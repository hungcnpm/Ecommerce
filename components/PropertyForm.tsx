"use client";

import { useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { X } from "lucide-react"

export default function PropertyForm({ existing, onDone }: any) {

  const [name, setName] = useState("")
  const [values, setValues] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [isVariant, setIsVariant] = useState(false)

  useEffect(() => {
    if (existing) {
      setName(existing.name || "")
      setValues(existing.values?.map((v:any)=>v.value) || [])
      setIsVariant(existing.isVariant || false)
    } else {
      setName("")
      setValues([])
      setIsVariant(false)
    }
  }, [existing])

  function addValue() {
    if (!input.trim()) return
    if (values.includes(input)) return toast.error("Duplicate value")

    setValues(prev => [...prev, input])
    setInput("")
  }

  function removeValue(val: string) {
    setValues(prev => prev.filter(v => v !== val))
  }

  async function save() {
    if (!name) return toast.error("Name required")

    let propertyId

    if (existing?._id) {
      await axios.put(`/api/properties/${existing._id}`, {
        name,
        isVariant
      })
      propertyId = existing._id
    } else {
      const res = await axios.post(`/api/properties`, {
        name,
        isVariant
      })
      propertyId = res.data.insertedId
    }

    // 🔥 insert values riêng
    await axios.post(`/api/propertyvalues/bulk`, {
      propertyId,
      values
    })

    toast.success("Saved")

    onDone && onDone()
    setName("")
    setValues([])
    setInput("")
    setIsVariant(false)
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5 space-y-5">
  
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold">
          {existing ? "Edit Property" : "Create Property"}
        </h2>
        <p className="text-sm text-gray-500">
          Define attributes like Color, Size...
        </p>
      </div>
  
      {/* NAME */}
      <div>
        <label className="label">Property Name</label>
        <input
          placeholder="e.g. Color, Size"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input"
        />
      </div>
  
      {/* VARIANT */}
      <div className="flex items-center justify-between border rounded-lg p-3">
        <div>
          <div className="text-sm font-medium">Use as Variant</div>
          <div className="text-xs text-gray-500">
            This property will create product variants
          </div>
        </div>
  
        <input
          type="checkbox"
          checked={isVariant}
          onChange={(e)=>setIsVariant(e.target.checked)}
          className="w-4 h-4"
        />
      </div>
  
      {/* ADD VALUE */}
      <div>
        <label className="label">Values</label>
  
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter value (e.g. Red)"
            className="input"
          />
  
          <button onClick={addValue} className="btn-primary whitespace-nowrap">
            Add
          </button>
        </div>
      </div>
  
      {/* VALUE LIST */}
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map(v => (
            <div
              key={v}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border"
            >
              {v}
              <button onClick={() => removeValue(v)} className="hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
  
      {/* ACTION */}
      <div className="flex gap-2 pt-2">
        <button onClick={save} className="flex-1 btn-primary">
          {existing ? "Update" : "Create"}
        </button>
  
        {existing && (
          <button
            onClick={onDone}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
  // return (
  //   <div className="space-y-4">

  //     <input
  //       placeholder="Property name (e.g. Color)"
  //       value={name}
  //       onChange={e => setName(e.target.value)}
  //       className="w-full border rounded-lg px-3 py-2"
  //     />

  //     {/* 🔥 NEW: VARIANT CHECK */}
  //     <label className="flex items-center gap-2 text-sm">
  //       <input
  //         type="checkbox"
  //         checked={isVariant}
  //         onChange={(e)=>setIsVariant(e.target.checked)}
  //       />
  //       Is Variant
  //     </label>

  //     <div className="flex gap-2">
  //       <input
  //         value={input}
  //         onChange={e => setInput(e.target.value)}
  //         placeholder="Add value"
  //         className="flex-1 border rounded-lg px-3 py-2"
  //       />

  //       <button onClick={addValue} className="px-4 bg-blue-600 text-white rounded-lg">
  //         Add
  //       </button>
  //     </div>

  //     <div className="flex flex-wrap gap-2">
  //       {values.map(v => (
  //         <div key={v} className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-full text-sm">
  //           {v}
  //           <button onClick={() => removeValue(v)}>
  //             <X size={14} />
  //           </button>
  //         </div>
  //       ))}
  //     </div>

  //     <button onClick={save} className="w-full py-2 bg-blue-600 text-white rounded-lg">
  //       Save Property
  //     </button>

  //   </div>
  // )
}
