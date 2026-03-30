"use client"

import { useEffect, useState } from "react"

export default function CategorySelect({
  value,
  onChange
}: {
  value: string
  onChange: (id: string) => void
}) {

  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  
  useEffect(() => {
    fetch("/api/categories?limit=9999")
      .then(res => res.json())
      .then(data => {
        setCategories(data.data || [])
      })
  }, [])

  useEffect(() => {
    function handleClick(e:any){
      if(!e.target.closest(".category-select")){
        setShowDropdown(false)
      }
    }
    document.addEventListener("click", handleClick)
    return ()=>document.removeEventListener("click", handleClick)
  },[])

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const selected = categories.find(
    c => c._id?.toString() === value?.toString()
  )

  return (
    <div className="relative category-select">

      <input
        value={search}
        onChange={e => {
          const val = e.target.value
          setSearch(val)
          setShowDropdown(true)

          // 👉 nếu xoá hết thì clear category
          if (val === "") {
            onChange("")
          }
        }}
        onFocus={() => {
          // 👉 nếu chưa có search thì lấy từ selected
          if (!search && selected) {
            setSearch(selected.name)
          }
          setShowDropdown(true)
        }}
        placeholder="Select category..."
        className="input"
      />

      {showDropdown && (
        <div className="absolute z-[9999] bg-white border w-full max-h-60 overflow-y-auto rounded shadow">

          <div
            onClick={() => {
              onChange("")
              setSearch("")
              setShowDropdown(false)
            }}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            No category
          </div>

          {filtered.map(cat => (
            <div
              key={cat._id}
              onClick={() => {
                onChange(cat._id)
                setSearch(cat.name) // 👉 giữ lại text luôn
                setShowDropdown(false)
              }}
              className={`px-3 py-2 cursor-pointer ${value === cat._id ? "bg-blue-100" : "hover:bg-blue-50"}`}
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
  )
}