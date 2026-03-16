import clientPromise from "@/lib/mongodb"

export async function GET() {
  const client = await clientPromise
  const db = client.db("ecommerce")
  const data = await db.collection("test").find().toArray()

  return Response.json(data)
}