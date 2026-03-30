"use client"

import { useEffect, useRef, useState } from "react"

export default function PropertyDropdown({
  properties,
  setProperties
}: any) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [allProperties, setAllProperties] = useState<any[]>([])

  const containerRef = useRef<HTMLDivElement>(null)

  // 🔥 fetch data
  useEffect(() => {
    fetch("/api/properties")
      .then(res => res.json())
      .then(data => setAllProperties(data))
  }, [])

  // 🔥 click outside (stable)
  useEffect(() => {
    function handleClick(e: any) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const filtered = allProperties.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={containerRef} className="mb-6 relative">
      <h3 className="font-semibold mb-2">Properties</h3>

      {/* INPUT */}
      <div
        className="border rounded-lg px-3 py-2 cursor-text"
        onClick={() => setOpen(true)}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search properties..."
          className="w-full outline-none"
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[9999]
          border rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">

          {filtered.length === 0 && (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No results
            </div>
          )}

          {filtered.map((p: any) => {
            const active = properties.includes(p._id.toString())

            return (
              <div
                key={p._id}
                onMouseDown={(e) => e.preventDefault()} // 🔥 giữ focus
                onClick={(e) => {
                  e.stopPropagation()

                  setProperties((prev: any) =>
                    prev.includes(p._id.toString())
                      ? prev.filter((id: any) => id !== p._id.toString())
                      : [...prev, p._id.toString()]
                  )
                }}
                className={`px-3 py-2 flex justify-between cursor-pointer text-sm
                  ${active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
                `}
              >
                {p.name}
                {active && "✓"}
              </div>
            )
          })}
        </div>
      )}

      {/* SELECTED */}
      <div className="flex flex-wrap gap-2 mt-2">
        {properties.map((id: any) => {
          const p = allProperties.find(
            (x: any) => x._id.toString() === id
          )
          if (!p) return null

          return (
            <span
              key={id}
              className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm flex items-center gap-1"
            >
              {p.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setProperties((prev: any) =>
                    prev.filter((x: any) => x !== id)
                  )
                }}
              >
                ✕
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}