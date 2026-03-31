"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import PropertyForm from "./PropertyForm"
import { Pencil, Trash2 } from "lucide-react"

export default function PropertyList() {

  const [properties, setProperties] = useState([])
  const [editing, setEditing] = useState(null)

  async function fetchData() {
    const res = await axios.get("/api/properties")
    setProperties(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function remove(id: string) {
    await axios.delete(`/api/properties/${id}`)
    fetchData()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>

        <div className="space-y-3">
          {properties.map((p: any) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition"
            >
              <div>
                <div className="font-medium text-gray-800">{p.name}</div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {p.values.map((v: any) => (
                    <span
                      key={v._id}
                      className="px-2 py-1 text-xs bg-gray-100 rounded-md"
                    >
                      {v.value}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="p-2 rounded-md hover:bg-blue-50 text-blue-600"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => remove(p._id)}
                  className="p-2 rounded-md hover:bg-red-50 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="text-lg font-semibold mb-4">
          {editing ? "Edit Property" : "Create Property"}
        </h2>

        <PropertyForm existing={editing} onDone={() => {
            setEditing(null)
            fetchData()
            }} 
        />
      </div>

    </div>
  )
}