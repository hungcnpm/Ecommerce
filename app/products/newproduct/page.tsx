import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct(){
  return(
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-center">New Product</h1>

      <ProductForm/>
    </Layout>
  )
}