"use client";

import { useState,useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImagesUpload from "./ImagesUpload";

export default function ProductForm({
  _id,
  title:existingTitle,
  description:existingDescription,
  price:existingPrice,
  images: existingImages,
  category:existingCategory,
  properties:existingProperties
}:any){

  const router = useRouter();

  const [title,setTitle] = useState(existingTitle || "");
  const [description,setDescription] = useState(existingDescription || "");
  const [price,setPrice] = useState(existingPrice || "");
  const [images,setImages] = useState(existingImages || []);

  const [categories,setCategories] = useState<any[]>([]);
  const [category,setCategory] = useState(existingCategory || "");
  const [productProperties,setProductProperties] = useState(existingProperties || {});

  useEffect(()=>{
    axios.get("/api/categories").then(res=>{
      setCategories(res.data)
    })
  },[])

  const selectedCategory = categories.find(c => c._id === category);
  const categoryProperties = selectedCategory?.properties || [];

  async function saveProduct(e:any){

    e.preventDefault();

    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties
    }

    if (_id) {
      await axios.put(`/api/products/${_id}`, data)
      toast.success("Product updated successfully")
    } else {
      await axios.post("/api/products", data)
      toast.success("Product created")
    }

    router.push("/products")
  }

  return(

    <form
      onSubmit={saveProduct}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md"
    >

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
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-3"
        value={price}
        onChange={ev=>setPrice(ev.target.value)}
        placeholder="Price"
      />

      <label>Category</label>

      <select
        value={category}
        onChange={ev=>setCategory(ev.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-4"
      >

        <option value="">No category</option>

        {categories.map(cat=>(
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}

      </select>

      {/* CATEGORY PROPERTIES */}

      {categoryProperties.length > 0 && (

        <div className="mb-4">

          <h3 className="font-semibold mb-2">
            Category properties
          </h3>

          {categoryProperties.map((prop:any)=>(

            <div key={prop.name} className="mb-3">

              <label>{prop.name}</label>

              <select
                value={productProperties[prop.name] || ""}
                onChange={ev=>setProductProperties(prev=>({
                  ...prev,
                  [prop.name]:ev.target.value
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
              >

                <option value="">
                  Select {prop.name}
                </option>

                {prop.values.map((v:any)=>(
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}

              </select>

            </div>

          ))}

        </div>

      )}

      <label>Images</label>

      <div className="mb-2 flex flex-wrap gap-2">
        <ImagesUpload
          images={images}
          setImages={setImages}
        />
      </div>

      <div className="flex gap-2 mt-4 justify-center">
        <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Save
        </button>
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="bg-red-600 px-4 py-2 text-white rounded-md hover:bg-red-700 cursor-pointer"
        >
          Cancel
        </button>

        

      </div>

    </form>
  )
}