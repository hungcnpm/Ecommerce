"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import ProductForm from "@/components/ProductForm"
import { useParams } from "next/navigation"
import Layout from "@/components/Layout"
export default function EditProduct() {
  const params = useParams()
  const id = params?.id as string

  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (!id) return

    axios.get(`/api/products/${id}`).then(res => {
      setProduct(res.data)
    })
  }, [id])

  if (!product) return null

  return (
      <Layout>
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <ProductForm {...product} />
      </Layout>
    )
}