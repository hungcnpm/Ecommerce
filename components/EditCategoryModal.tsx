"use client"

import { useEffect, useState } from "react"
import PropertyDropdown from "./PropertyDropdown"
import MultiSelect from "./MultiSelect"
export default function EditCategoryModal({
  open,
  onClose,
  category,
  onSave,
  properties,
  setProperties
}: any) {

  const [name, setName] = useState("")
  const [parent, setParent] = useState("")
  const [parentSearch, setParentSearch] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  const [allProperties, setAllProperties] = useState<any[]>([])

  const [isActive, setIsActive] = useState(true)
  const [searchProp, setSearchProp] = useState("")
  const [showPropDropdown, setShowPropDropdown] = useState(false)


  const filteredProps = allProperties.filter((p: any) =>
    p.name.toLowerCase().includes(searchProp.toLowerCase())
  )
  useEffect(() => {
    function handleClick(e: any) {
      if (!e.target.closest(".parent-select")) {
        setShowDropdown(false)
      }
      if (!e.target.closest(".prop-select")) {
        setShowPropDropdown(false)
      }
    }
  
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
  // 🔥 LOAD CATEGORY
  useEffect(() => {
    if (category) {
      setName(category.name || "")

      const parentId = category.parent?._id || category.parent || ""
      setParent(parentId)
      setParentSearch(category.parent?.name || "")
      setIsActive(category.isActive ?? true)
    }
  }, [category])

  // 🔥 LOAD ALL PROPERTIES
  useEffect(() => {
    fetch("/api/properties")
      .then(res => res.json())
      .then(data => setAllProperties(data))
  }, [])

  const options = allProperties.map(p => ({
    label: p.name,
    value: p._id.toString()
  })) 
  // 🔥 SEARCH CATEGORY (debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch(`/api/categories?limit=9999`)
        .then(res => res.json())
        .then(data => {
          const filtered = (data.data || []).filter(
            (c: any) =>
              c._id !== category?._id &&
              c.name.toLowerCase().includes(parentSearch.toLowerCase())
          )
          setSuggestions(filtered)
        })
    }, 200)

    return () => clearTimeout(timer)
  }, [parentSearch])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
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

          {/* 🔥 PARENT SELECT */}
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
                className="absolute right-2 inset-y-0 flex items-center text-gray-400 mb-4 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            )}

            {showDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">

                <div
                  onClick={() => {
                    setParent("")
                    setParentSearch("")
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

          {/* ACTIVE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Active</span>
          </div>
        </div>

        {/* 🔥 PROPERTY CHECKBOX */}
          {/* <PropertyDropdown properties={properties} setProperties={setProperties} 
          /> */}
        <MultiSelect
          options={options}
          value={properties}
          onChange={setProperties}
          placeholder="Search properties..."
        
        />

        {/* ACTION */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                onClose()
              }
            }}
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({
                name,
                parent,
                isActive,
                properties // ✅ FIX: chỉ gửi ID
              })
            } 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  )
}