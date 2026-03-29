"use client";

import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConfirmModal from "@/components/ConfirmModal"
import toast from "react-hot-toast"

export default function Products() {
  const [products, setProducts] = useState([]);
  const [productToDelete,setProductToDelete] = useState(null);
  async function loadProducts(){
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
  }
  
  useEffect(()=>{
    loadProducts()
  },[])
 
  async function deleteProduct(id: string) {
    await axios.delete(`/api/products/${id}`)
    setProducts(products.filter((p: any) => p._id !== id))
    toast.success("Product deleted")

    setProductToDelete(null)
  
    loadProducts()
  }

  return (
    <Layout>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          href="/products/newproduct"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      <table className="products">

        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Brand</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {products?.length > 0 && products.map((product:any)=>(
            <tr key={product._id}>

              <td>
              {product.images?.length > 0 ? (
                <img
                  src={product.images[0]}
                  className="w-12 h-12 object-cover rounded-md"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
              )}
              </td>

              <td className="font-semibold">{product.title}</td>
              <td>{product.brand||"No brand"}</td>
              <td>{product.category?.name||"No category"}</td>
              <td>{product.description}</td>

              <td className="text-blue-600 font-semibold">
                ${product.price}
              </td>

              <td>
                <Link
                  href={"/products/edit/"+product._id}
                  className="btn-edit"
                >
                  Edit
                </Link>

                <button
                  onClick={() => setProductToDelete(product)}
                  className="btn-delete"
                > 
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>
      {productToDelete && (
      <ConfirmModal
        title={`Delete "${productToDelete.title}" ?`}
        onConfirm={()=>deleteProduct(productToDelete._id)}
        onCancel={()=>setProductToDelete(null)}
      />
      )}
    </Layout>
  );
}