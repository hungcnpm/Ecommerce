"use client"

import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { X } from "lucide-react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
export default function PropertyForm({ existing, onDone }: any) {

  const [name, setName] = useState(existing?.name || "")
  const [values, setValues] = useState(existing?.values || [])
  const [input, setInput] = useState("")
  const router = useRouter()
  useEffect(() => {
    if (existing) {
      setName(existing.name || "")
      setValues(existing.values || [])
    } else {
      setName("")
      setValues([])
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

    if (existing?._id) {
      await axios.put(`/api/properties/${existing._id}`, { name, values })
      toast.success("Updated")
    } else {
      await axios.post(`/api/properties`, { name, values, isVarian: true })
      toast.success("Created")
    }
    onDone&& onDone()
    setName("")
    setValues([])   
    setInput("")
  }

  return (
    <div className="space-y-4">

      <input
        placeholder="Property name (e.g. Color)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add value"
          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <button
          onClick={addValue}
          className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {values.map(v => (
          <div
            key={v}
            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
          >
            {v}
            <button onClick={() => removeValue(v)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={save}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Save Property
      </button>
        {existing && (
        <button
            onClick={()=>{
                onDone&& onDone()
    setName("")
    setValues([])   
    setInput("")
            }}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
            Cancel
        </button>

      )}

    </div>
  )
}