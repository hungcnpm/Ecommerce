"use client"

import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import ConfirmModal from "@/components/ConfirmModal"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import EditCategoryModal from "@/components/EditCategoryModal"
import PropertyDropdown from "@/components/PropertyDropdown"
import MultiSelect from "@/components/MultiSelect"
export default function CategoriesPage() {
const router = useRouter()

const [name, setName] = useState("")
const [parent, setParent] = useState("")
const [categories, setCategories] = useState<any[]>([])
const [isActive, setIsActive] = useState(true)

const [editingCategory, setEditingCategory] = useState(null)
const [showEditModal, setShowEditModal] = useState(false)
const [categoryToDelete, setCategoryToDelete] = useState<any>(null)

const [page, setPage] = useState(1)
const [hasMore, setHasMore] = useState(true)
const [loading, setLoading] = useState(false)

const [suggestions, setSuggestions] = useState<any[]>([])
const [showDropdown, setShowDropdown] = useState(false)

const [allCategories, setAllCategories] = useState<any[]>([])
const [parentSearch, setParentSearch] = useState("")
const [showParentDropdown, setShowParentDropdown] = useState(false)

const [statusFilter, setStatusFilter] = useState("all")
const [updatingId, setUpdatingId] = useState<string | null>(null)

const [allProperties, setAllProperties] = useState([])
const [properties, setProperties] = useState([])
const [searchCategory, setSearchCategory] = useState("")
const [searchProperty, setSearchProperty] = useState("")


useEffect(() => {
  fetchAllCategories()
}, [])
useEffect(() => {
  fetch("/api/properties")
    .then(res => res.json())
    .then(data => setAllProperties(data))
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
    fetchCategories(1, searchCategory)
  }, 400)

  return () => clearTimeout(timer)
}, [searchCategory])

useEffect(() => {
  if (!searchCategory) {
    setSuggestions([])
    return
  }

  fetchSuggestions(searchCategory)
  setShowDropdown(true)
}, [searchCategory])
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

async function fetchCategories(pageParam = page, keyword = searchCategory) {
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
async function saveCategory(ev: any) {
ev.preventDefault()
setLoading(true)

const data = {
  name,
  parent: parent || null,
  isActive,
  properties,
  // properties: properties.map(p => ({
  //   name: p.name,
  //   type: p.type,
  //   values: p.values.split(",").map((v: string) => v.trim()),
  //   isFilterable: true
  // }))
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
  setSearchProperty("")
  setSearchCategory("") 
  setIsActive(true)
  await fetchCategories(1)

} catch (error) {
  toast.error("Something went wrong")
}

setLoading(false)


}

function editCategory(cat: any) {
  const clone = JSON.parse(JSON.stringify(cat)) // 🔥 FIX clone
  setEditingCategory(clone) // 🔥 FIX
  setProperties((clone.properties || []).map((id:any)=>id.toString())) // 🔥 FIX
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
  await fetchCategories(1)

}
const options = allProperties.map(p => ({
  label: p.name,
  value: p._id.toString()
}))
function handleSelect(item: any) {
  setSearchCategory(item.name)
  setShowDropdown(false)
  
  setCategories([])
  setPage(1)
  setHasMore(true)
  fetchCategories(1, item.name)
}
async function toggleActive(cat: any) {
  const newStatus = !cat.isActive
  setUpdatingId(cat._id)

  // optimistic UI
  setCategories(prev =>
    prev.map(c =>
      c._id === cat._id ? { ...c, isActive: newStatus } : c
    )
  )

  try {
    await fetch(`/api/categories/${cat._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: cat.name,
        parent: cat.parent?._id || cat.parent || null,
        properties: cat.properties || [],
        isActive: newStatus
      })
    })

    toast.success("Updated")
  } catch {
    toast.error("Failed")

    // rollback
    setCategories(prev =>
      prev.map(c =>
        c._id === cat._id ? { ...c, isActive: !newStatus } : c
      )
    )
  }

  setUpdatingId(null)
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
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Active</span>
        </div>
        </div>

        {/* properties */}
        
        {/* <PropertyDropdown properties={properties} setProperties={setProperties}/> */}
        <MultiSelect
          options={options}
          value={properties}
          onChange={setProperties}
          placeholder="Search properties..."
        />
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  </div>

  <div className="mt-2">
    <div className="mb-4 flex gap-2">
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border p-3 rounded-lg"
    >
      <option value="all" >All</option>
      <option value="active">Active</option>
      <option value="hidden">Hidden</option>
    </select>
  </div>
  {/* 🔥 SEARCH */} 
    <div className="mb-4 flex items-center gap-2"> 
      <div className="relative w-80 search-box"> 
        <input value={searchCategory} onChange={e => { 
          setSearchCategory(e.target.value) 
          setShowDropdown(true) }} 
          placeholder="Search category..." 
          className="border rounded px-3 h-[50px] w-full pr-8" 
          onFocus={() => setShowDropdown(true)} 
          onKeyDown={e => { 
            if (e.key === "Enter") { 
              setCategories([]) 
              setPage(1) 
              setHasMore(true) 
              setShowDropdown(false) } }} 
            /> {/* ✅ FIX CLEAR BUTTON */} 
        {searchCategory && ( 
          <button 
            onClick={() => { 
            setSearchCategory("") 
            setCategories([]) 
            setPage(1) 
            setHasMore(true) }} 
            className="absolute h-[50px] right-2 inset-y-0 flex items-center text-gray-400 hover:text-black cursor-pointer" > 
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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
          {categories.filter(cat => {
              if (statusFilter === "active") return cat.isActive
              if (statusFilter === "hidden") return !cat.isActive
              return true
            }).map(cat => {
              return (
                <tr key={cat._id}
                  className={`border-t hover:bg-gray-50 ${
                  !cat.isActive ? "opacity-50" : ""
                  }`}>
                  <td>
                  {"— ".repeat(cat.level || 0)} {cat.name}
                  {!cat.isActive && (
                    <span className="text-red-500 ml-2">(Hidden)</span>
                  )}
                  </td>

                  <td>{cat.parent?.name || "-"}</td>
                  <td>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cat.isActive}
                      onChange={() => toggleActive(cat)}
                      className="peer sr-only"
                    />

                    {/* track */}
                    <div className="w-11 h-6 bg-gray-200 rounded-full transition-all relative peer-checked:bg-green-500 peer-checked:[&>div]:translate-x-5">

                      {/* thumb */}
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300"></div>

                    </div>

                  </label>
                  </td>
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
                      Hide
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
        setProperties([]) 
      }}
      category={editingCategory}
      properties={properties}
      setProperties={setProperties}
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
