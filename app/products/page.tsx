"use client";

import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("/api/products").then(res => {
      setProducts(res.data);
    });
  }, []);

  async function deleteProduct(id: string) {
    await axios.delete(`/api/products/${id}`)
    setProducts(products.filter((p: any) => p._id !== id))
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
            <th>Description</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {products?.length > 0 && products.map((product:any)=>(
            <tr key={product._id}>

              <td>
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
              </td>

              <td className="font-semibold">{product.title}</td>

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
                  onClick={()=>deleteProduct(product._id)}
                  className="btn-delete"
                > 
                  Delete
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </Layout>
  );
}