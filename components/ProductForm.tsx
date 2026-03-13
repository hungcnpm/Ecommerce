"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice
}:any){
  console.log({_id});
  const router = useRouter();

  const [title,setTitle] = useState(existingTitle || "");
  const [description,setDescription] = useState(existingDescription || "");
  const [price,setPrice] = useState(existingPrice || "");
  
  async function saveProduct(e: any) {
    e.preventDefault()

    const data = { title, description, price }

    if (_id) {
      await axios.put(`/api/products/${_id}`, data)
    } else {
      await axios.post("/api/products", data)
    }

    router.push("/products")
  }
  return(
    <form onSubmit={saveProduct} className="max-w-md">

      <label>Product Name</label>
      <input
        value={title}
        onChange={ev=>setTitle(ev.target.value)}
        placeholder="Product name"
      />

      <label>Description</label>
      <textarea
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

      <button className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">
        Save
      </button>

    </form>
  )
}