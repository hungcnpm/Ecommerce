import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct(){
  return(
    <Layout>
      <h1 className="text-2xl font-bold mb-6">New Product</h1>

      <ProductForm/>
    </Layout>
  )
}