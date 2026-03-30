import Layout from "@/components/Layout"
import PropertyList from "@/components/PropertyList"

export default function Page() {
  return (
    <Layout>
        <div className="p-6">
            <PropertyList />
        </div>
    </Layout>
  )
}