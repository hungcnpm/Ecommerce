"use client"

import { useEffect, useState } from "react"

export default function EditCategoryModal({
  open,
  onClose,
  category,
  onSave
}: any) {
  const [name, setName] = useState("")
  const [parent, setParent] = useState("")
  const [parentSearch, setParentSearch] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [isActive, setIsActive] = useState(true) // ✅ NEW

  // load data
  useEffect(() => {
    if (category) {
      setName(category.name || "")

      const parentId = category.parent?._id || category.parent || ""
      setParent(parentId)
      setParentSearch(category.parent?.name || "")
      setIsActive(category.isActive ?? true)
      setProperties(
        (category.properties || []).map((p: any) => ({
          name: p.name,
          type: p.type || "text",
          values: (p.values || []).join(",")
        }))
      )
    }
  }, [category])
  useEffect(() => {
    function handleClick(e: any) {
      if (!e.target.closest(".parent-select")) {
        setShowDropdown(false)
      }
    }
  
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
  // 🔥 lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  // 🔥 search parent
  useEffect(() => {
    if (!parentSearch) {
      fetch(`/api/categories?limit=9999`)
        .then(res => res.json())
        .then(data => {
          const filtered = (data.data || []).filter(
            (c: any) => c._id !== category?._id
          )
          setSuggestions(filtered)
        })
      return
    }
   
    const timer = setTimeout(() => {
      fetch(`/api/categories?search=${parentSearch}&limit=10`)
        .then(res => res.json())
        .then(data => {
          const filtered = (data.data || []).filter(
            (c: any) => c._id !== category?._id
          )
          setSuggestions(filtered)
        })
    }, 300)

    return () => clearTimeout(timer)
  }, [parentSearch])

  // 🔥 property logic giống form chính
  function addProperty() {
    setProperties(prev => [
      ...prev,
      { name: "", values: "", type: "text" }
    ])
  }

  function updateProperty(index: number, field: string, value: string) {
    const props = [...properties]
    props[index][field] = value
    setProperties(props)
  }

  function removeProperty(index: number) {
    const props = [...properties]
    props.splice(index, 1)
    setProperties(props)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 "
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-[700px] max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          Edit Category
        </h2>

        {/* NAME + PARENT */}
        <div className="flex gap-4 mb-6">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Category name"
            className="border rounded-md p-2 w-1/2 h-12"
          />

          {/* PARENT SEARCH */}
          <div className="relative w-1/2 parent-select">
            <input
              value={parentSearch}
              onChange={e => {
                setParentSearch(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Select parent..."
              className="border rounded-md p-2 h-12 w-full pr-10"
            />

            {parent && (
              <button
                onClick={() => {
                  setParent("")
                  setParentSearch("")
                }}
                className="absolute right-2 inset-y-0 flex items-center text-gray-400"
              >
                ✕
              </button>
            )}

            {showDropdown && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-[9999] max-h-60 overflow-auto">
                <div
                  onClick={() => {
                    setParent("")
                    setParentSearch("No parent")
                    setShowDropdown(false)
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  No parent
                </div>

                {suggestions.map(cat => (
                  <div
                    key={cat._id}
                    onClick={() => {
                      setParent(cat._id)
                      setParentSearch(cat.name)
                      setShowDropdown(false)
                    }}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                  >
                    <span className="text-gray-400">
                      {"— ".repeat(cat.level || 0)}
                    </span>
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>
           {/* ✅ isActive */}
          <div className="mb-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active</span>
          </div>
        </div>
       
        {/* PROPERTIES (y chang form chính) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Properties</h3>

            <button
              type="button"
              onClick={addProperty}
              className="bg-blue-200 px-3 py-1 rounded"
            >
              + Add property
            </button>
          </div>

          {properties.length > 0 && (
            <div className="grid grid-cols-12 gap-3 mb-2 text-sm text-gray-500">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-5">Values</div>
              <div className="col-span-2"></div>
            </div>
          )}

          {properties.map((prop, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 items-center mb-2"
            >
              <input
                value={prop.name}
                onChange={e =>
                  updateProperty(index, "name", e.target.value)
                }
                className="border rounded col-span-3"
              />

              <select
                value={prop.type}
                onChange={e =>
                  updateProperty(index, "type", e.target.value)
                }
                className="border rounded p-2 col-span-2 mb-4"
              >
                <option value="text">Text</option>
                <option value="select">Select</option>
              </select>

              <input
                value={prop.values}
                onChange={e =>
                  updateProperty(index, "values", e.target.value)
                }
                className="border rounded col-span-5"
              />

              <button
                onClick={() => removeProperty(index)}
                className="btn-delete col-span-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({
                name,
                parent,
                isActive,
                properties: properties.map(p => ({
                  name: p.name,
                  type: p.type,
                  values: p.values.split(",").map((v: string) => v.trim()),
                  isFilterable: true
                }))
              })
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}