"use client"

import {useState} from "react"
import axios from "axios"

import {DndContext, 
    closestCenter, 
    PointerSensor,
    useSensor,
    useSensors} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable"

import {CSS} from "@dnd-kit/utilities"

function SortableImage({ url, remove }) {
    const {attributes, listeners, setNodeRef, transform, transition} =
      useSortable({ id: url });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

  return (
    <div ref={setNodeRef} style={style} className="relative w-24 h-24">
      
      {/* Drag handle */}
      <img
        src={url}
        className="w-24 h-24 object-cover rounded-md"
        {...attributes}
        {...listeners}
      />

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          remove(url);
        }}
        className="absolute top-1 right-1 bg-red-500 text-white rounded px-1 z-50 poiter-events-auto"
      >
        ✕
      </button>

    </div>
  )
}

export default function ImageUpload({images, setImages}) {
    const [uploading, setUploading] = useState(false)
    async function uploadImage(ev) {
    setUploading(true)
    const files = ev.target.files

    const data = new FormData()

    for (const file of files) {
      data.append("file", file)
    }

    const res = await axios.post("/api/upload", data)

    setImages(old => [...old, ...res.data.links])

    setUploading(false)
  }

  function removeImage(url: string) {
    setImages(old => old.filter(img => img !== url))
  }

  return (
    <div>
      <DndContext
        collisionDetection={closestCenter}
        sensors={useSensors(
            useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
            })
        )}
        onDragEnd={(event) => {
          const {active, over} = event

          if (active.id !== over?.id) {
            const oldIndex = images.indexOf(active.id)
            const newIndex = images.indexOf(over.id)

            setImages(arrayMove(images, oldIndex, newIndex))
          }
        }}
      >

        <SortableContext items={images} strategy={rectSortingStrategy}>

          <div className="flex gap-3 flex-wrap">

            {images.map(link => (
              <SortableImage
                key={link}
                url={link}
                remove={removeImage}
              />
            ))}
            {uploading && (
                <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}
            <label className="w-24 h-24 bg-gray-200 rounded-lg cursor-pointer">
            
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-1">
                
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16"
                />
                </svg>

                <span>Upload</span>

            </div>

            <input
                type="file"
                className="hidden"
                onChange={uploadImage   }
            />

            </label>

          </div>

        </SortableContext>

      </DndContext>

    </div>
  )
}