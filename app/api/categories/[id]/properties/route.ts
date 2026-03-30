import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req, { params }) {
  const { id } = await params // 🔥 FIX

  const db = (await clientPromise).db()

  const category = await db.collection("categories").findOne({
    _id: new ObjectId(id)
  })

  if (!category) {
    return Response.json([], { status: 404 })
  }

  const props = await db.collection("properties").find({
    _id: {
      $in: (category.properties || []).map((id: any) => new ObjectId(id))
    }
  }).toArray()
  return Response.json(props)
}