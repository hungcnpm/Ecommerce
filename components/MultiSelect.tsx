"use client"

import { useEffect, useRef, useState } from "react"

export default function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
}: any) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // 🔥 click outside
  useEffect(() => {
    function handleClick(e: any) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  const filtered = options.filter((o: any) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )

  function toggle(val: string) {
    if (value.includes(val)) {
      onChange(value.filter((v: string) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">

      {/* INPUT BOX */}
      <div
        className="border rounded-lg px-3 py-2 flex flex-wrap gap-2 cursor-text min-h-[42px]"
        onClick={() => setOpen(true)}
      >
        {value.map((v: string) => {
          const item = options.find((o: any) => o.value === v)
          if (!item) return null

          return (
            <span
              key={v}
              className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm flex items-center gap-1"
            >
              {item.label}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(value.filter((x: string) => x !== v))
                }}
              >
                ✕
              </button>
            </span>
          )
        })}

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 outline-none min-w-[120px]"
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 z-[9999]
          border rounded-lg bg-white shadow max-h-60 overflow-y-auto">

          {filtered.length === 0 && (
            <div className="px-3 py-2 text-gray-400 text-sm">
              No results
            </div>
          )}

          {filtered.map((o: any) => {
            const active = value.includes(o.value)

            return (
              <div
                key={o.value}
                onMouseDown={(e) => e.preventDefault()} // giữ focus
                onClick={(e) => {
                  e.stopPropagation()
                  toggle(o.value)
                }}
                className={`px-3 py-2 flex justify-between cursor-pointer text-sm
                  ${active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
                `}
              >
                {o.label}
                {active && "✓"}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}