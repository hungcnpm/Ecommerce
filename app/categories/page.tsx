"use client"

import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import ConfirmModal from "@/components/ConfirmModal"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import EditCategoryModal from "@/components/EditCategoryModal"
export default function CategoriesPage() {
const router = useRouter()

const [name, setName] = useState("")
const [parent, setParent] = useState("")
const [categories, setCategories] = useState<any[]>([])
const [properties, setProperties] = useState<any[]>([])
const [editingCategory, setEditingCategory] = useState(null)
const [showEditModal, setShowEditModal] = useState(false)
const [categoryToDelete, setCategoryToDelete] = useState<any>(null)

const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)
const [loading, setLoading] = useState(false)

const [search, setSearch] = useState("")
const [suggestions, setSuggestions] = useState<any[]>([])
const [showDropdown, setShowDropdown] = useState(false)

const [allCategories, setAllCategories] = useState<any[]>([])
const [parentSearch, setParentSearch] = useState("")
const [showParentDropdown, setShowParentDropdown] = useState(false)

useEffect(() => {
  fetchAllCategories()
}, [])

async function fetchAllCategories() {
  const res = await fetch("/api/categories?limit=9999")
  const data = await res.json()

  setAllCategories(data.data || [])
}
const filteredParents = allCategories.filter(c =>
  c.name.toLowerCase().includes(parentSearch.toLowerCase())
)
// reset khi search
useEffect(() => {
  const timer = setTimeout(() => {
    setCategories([])
    setPage(1)
    setHasMore(true)
    fetchCategories(1, search)
  }, 400)

  return () => clearTimeout(timer)
}, [search])

useEffect(() => {
  if (!search) {
    setSuggestions([])
    return
  }

  fetchSuggestions(search)
  setShowDropdown(true)
}, [search])
useEffect(() => {
  function handleClick(e: any) {
    if (!e.target.closest(".search-box")) {
      setShowDropdown(false)
    }
    if (!e.target.closest(".parent-select")) {
      setShowParentDropdown(false)
    }
  }

  document.addEventListener("click", handleClick)
  return () => document.removeEventListener("click", handleClick)
}, [])
async function fetchSuggestions(keyword: string) {
  if (!keyword) {
    setSuggestions([])
    return
  }

  const res = await fetch(`/api/categories?search=${keyword}&limit=5`)
  const data = await res.json()

  setSuggestions(data.data || [])
}

async function fetchCategories(pageParam = page, keyword = search) {
  if (loading) return

  // 🔥 CHỈ block khi scroll (page > 1)
  if (!hasMore && pageParam !== 1) return

  setLoading(true)

  const res = await fetch(
    `/api/categories?page=${pageParam}&limit=50&search=${keyword}`
  )
  const result = await res.json()

  if (pageParam === 1) {
    setCategories(result.data)
  } else {
    setCategories(prev => [...prev, ...result.data])
  }

  if (pageParam >= result.totalPages) {
    setHasMore(false) 
  }

  setLoading(false)
}

// 🔥 infinite scroll (IntersectionObserver)
useEffect(() => {
  const el = document.getElementById("load-more")
  if (!el) return // 🔥 FIX

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchCategories(nextPage)
    }
  })

  observer.observe(el)

  return () => observer.disconnect()
}, [hasMore, loading, page])

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

async function handleParentChange(parentId: string) {
setParent(parentId)


if (!parentId || editingCategory) return

const parentCategory = categories.find(c => c._id === parentId)

if (parentCategory?.properties) {
  setProperties(
    parentCategory.properties.map((p: any) => ({
      name: p.name,
      type: p.type || "text",
      values: (p.values || []).join(",")
    }))
  )
}


}

async function saveCategory(ev: any) {
ev.preventDefault()
setLoading(true)


const data = {
  name,
  parent: parent || null,
  properties: properties.map(p => ({
    name: p.name,
    type: p.type,
    values: p.values.split(",").map((v: string) => v.trim()),
    isFilterable: true
  }))
}

try {
  if (editingCategory) {
    await fetch(`/api/categories/${editingCategory._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    toast.success("Category updated")
  } else {
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    toast.success("Category created")
  }

  // 🔥 reset infinite scroll
  setCategories([])
  setPage(1)
  setHasMore(true)

  setName("")
  setParent("")
  setProperties([])
  setEditingCategory(null)
  setParentSearch("") 
  await fetchCategories(1)

} catch (error) {
  toast.error("Something went wrong")
}

setLoading(false)


}

function editCategory(cat: any) {
  setEditingCategory(cat)
  setShowEditModal(true)
}

async function deleteCategory(id: string) {
await fetch(`/api/categories/${id}`, {
method: "DELETE"
})


toast.success("Category hidden")
setCategoryToDelete(null)

// 🔥 reset list
setCategories([])
setPage(1)
setHasMore(true)


}

function handleSelect(item: any) {
  setSearch(item.name)
  setShowDropdown(false)
  
  setCategories([])
  setPage(1)
  setHasMore(true)
  fetchCategories(1, item.name)
}
return ( 
<Layout> 
  <div className="flex justify-center"> 
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl w-full"> 
      <div className="flex justify-center"> 
        <h1 className="text-xl font-semibold mb-6">
          {editingCategory ? "Edit Category" : "New Category"} 
        </h1> 
      </div>


      <form onSubmit={saveCategory}>
        <div className="flex gap-4 mb-6">
          <input
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder="Category name"
            className="border rounded-md p-2 w-1/2 h-12"
          />
         <div className="relative w-1/2 parent-select h-12">

          {/* INPUT */}
          <input
          value={parentSearch}
            onChange={e => {
            setParentSearch(e.target.value)
            setShowParentDropdown(true)
            }}
            onFocus={() => setShowParentDropdown(true)}
            placeholder="Select parent category..."
            className="border rounded-md p-2 h-12 w-full pr-10"
          />

          {/* CLEAR */}
          {parent && (
            <button
            onClick={() => {
            setParent("")
            setParentSearch("")
            }}
            className="absolute right-2 inset-y-0 flex items-center text-gray-400 hover:text-black cursor-pointer"
          >
          X </button>
          )}

          {/* DROPDOWN */}
          {showParentDropdown && ( <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">


            {/* NO PARENT */}
            <div
              onClick={() => {
                setParent("")
                setParentSearch("No parent")
                setShowParentDropdown(false)
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              No parent
            </div>

            {/* LIST */}
            {filteredParents.map(cat => (
              <div
                key={cat._id}
                onClick={() => {
                  setParent(cat._id)
                  setParentSearch(cat.name)
                  setShowParentDropdown(false)
                }}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
              >
                <span className="text-gray-400">
                  {"— ".repeat(cat.level || 0)}
                </span>
                {cat.name}
              </div>
            ))}

            {/* EMPTY */}
            {filteredParents.length === 0 && (
              <div className="px-3 py-2 text-gray-400 text-sm">
                No results
              </div>
            )}
          </div>


          )}

        </div>

        </div>

        {/* properties */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Properties</h3>

            <button
              type="button"
              onClick={addProperty}
              className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300 cursor-pointer"
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
            
            <div key={index} className="grid grid-cols-12 gap-3 items-center mb-2">
              
              <input
                value={prop.name}
                onChange={ev =>
                  updateProperty(index, "name", ev.target.value)
                }
                placeholder="Property name"
                className="border rounded col-span-3 "
              />

              <select
                value={prop.type}
                onChange={ev =>
                  updateProperty(index, "type", ev.target.value)
                }
                className="border rounded p-2 col-span-2 mb-4"
              >
                <option value="text">Text</option>
                <option value="select">Select</option>
              </select>

              <input
                value={prop.values}
                onChange={ev =>
                  updateProperty(index, "values", ev.target.value)
                }
                placeholder="Values (comma separated)"
                className="border rounded col-span-5"
              />

              <button
                type="button"
                onClick={() => removeProperty(index)}
                className="btn-delete col-span-2 p-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>

          {/* {editingCategory && ( 
            <button
              type="button"
              onClick={() => {
                setName("")
                setParent("")
                setProperties([])
                setEditingCategory(null)
                setParentSearch("")
                router.push("/categories")
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
            >
              Cancel
            </button>
          )} */}
        </div>
      </form>
    </div>
  </div>

  <div className="mt-2">
  {/* 🔥 SEARCH */} 
    <div className="mb-4 flex items-center gap-2"> 
      <div className="relative w-80 search-box"> 
        <input value={search} onChange={e => { 
          setSearch(e.target.value) 
          setShowDropdown(true) }} 
          placeholder="Search category..." 
          className="border rounded px-3 h-[40px] w-full pr-8" 
          onFocus={() => setShowDropdown(true)} 
          onKeyDown={e => { 
            if (e.key === "Enter") { 
              setCategories([]) 
              setPage(1) 
              setHasMore(true) 
              setShowDropdown(false) } }} 
            /> {/* ✅ FIX CLEAR BUTTON */} 
        {search && ( 
          <button 
            onClick={() => { 
            setSearch("") 
            setCategories([]) 
            setPage(1) 
            setHasMore(true) }} 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black" > 
            ✕ 
          </button> )} 
          {/* DROPDOWN */} 
          {showDropdown && suggestions.length > 0 && ( 
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-auto"> 
            {suggestions.map(item => ( 
              <div key={item._id} 
                onClick={() => handleSelect(item)} 
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm" > 
                <span className="text-gray-400"> {"— ".repeat(item.level || 0)} 
                  </span> 
                  {item.name} 
                  </div> 
                ))} 
                </div> 
              )} 
              </div> 
    </div> 
    
        <table className="products">
          <thead>
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map(cat => {
              return (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td>
                    {"— ".repeat(cat.level || 0)} {cat.name}
                  </td>

                  <td>{cat.parent?.name || "-"}</td>

                  <td>
                  <button
                    onClick={() => editCategory(cat)}
                    className="btn-edit"
                  >
                    Edit
                  </button>

                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* 🔥 load more trigger */}
        <div id="load-more" className="h-10"></div>

        {/* loading */}
        {loading && (
          <div className="text-center py-4 text-gray-500">
            Loading...
          </div>
        )}

        {!hasMore && (
          <div className="text-center py-4 text-gray-400">
            No more categories
          </div>
        )}

    {categoryToDelete && (
      <ConfirmModal
        title={`Hide "${categoryToDelete.name}" ?`}
        onConfirm={() => deleteCategory(categoryToDelete._id)}
        onCancel={() => setCategoryToDelete(null)}
      />
    )}
    <EditCategoryModal
      open={showEditModal}
      onClose={() => {
        setShowEditModal(false)
        setEditingCategory(null) // 🔥 FIX
      }}
      category={editingCategory}
      onSave={async (data: any) => {
        await fetch(`/api/categories/${editingCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })

        toast.success("Updated")

        setShowEditModal(false)
        setEditingCategory(null)
        // ✅ update UI ngay (không reset scroll)
        setCategories(prev =>
          prev.map(c =>
            c._id === editingCategory._id
              ? {
                  ...c,
                  name: data.name,
                  parent:
                    data.parent
                      ? allCategories.find(p => p._id === data.parent) || null
                      : null
                }
              : c
          )
        )
        fetchCategories(1)
      }}
    />
  </div>
</Layout>
)
}
