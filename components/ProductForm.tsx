"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
  images: existingImages
}:any){
  console.log({_id});
  const router = useRouter();

  const [title,setTitle] = useState(existingTitle || "");
  const [description,setDescription] = useState(existingDescription || "");
  const [price,setPrice] = useState(existingPrice || "");
  const [images,setImages] = useState(existingImages || [])
  async function uploadImages(ev:any){

    const files = ev.target.files
  
    for(const file of files){
  
      const data = new FormData()
      data.append("file",file)
  
      const res = await fetch("/api/upload",{
        method:"POST",
        body:data
      })
  
      const img = await res.json()
  
      setImages(old => [...old,img.url])
    }
  }
  async function saveProduct(e: any) {
    e.preventDefault()

    const data = {
      title,
      description,
      price,
      images
    }

    if (_id) {
      await axios.put(`/api/products/${_id}`, data)
    } else {
      await axios.post("/api/products", data)
    }
    if(_id)
      toast.success("Product updated successfully")
    else
      toast.success("Product created  ")
    router.push("/products")
  }
  return(
    <form onSubmit={saveProduct} className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md" >

      <label>Product Name</label>
      <input
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-3"
        value={title}
        onChange={ev=>setTitle(ev.target.value)}
        placeholder="Product name"
      />

      <label>Description</label>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-3"
        value={description}
        onChange={ev=>setDescription(ev.target.value)}
        placeholder="Description"
      />

      <label>Price</label>
      <input
        value={price}
        onChange={ev=>setPrice(ev.target.value)}
        placeholder="Price"
      />
      <label>Images</label>

      <div className="mb-2">
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
            onChange={uploadImages}
          />

        </label>
        {!images?.length && (
          <div>No photos in this product</div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        {images.map(link => (
          <img
            key={link}
            src={link}
            className="w-20 h-20 object-cover rounded"
          />
        ))}
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md mt-4 block mx-auto transition">
        Save
      </button>

    </form>
  )
}