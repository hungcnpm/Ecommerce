import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(req, { params }) {
    const { id } = await params
  
    const db = (await clientPromise).db()
    const body = await req.json()
  
    await db.collection("properties").updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    )
  
    return Response.json({ ok: true })
  }

export async function DELETE(req, { params }) {
  const db = (await clientPromise).db()

  await db.collection("properties").deleteOne({
    _id: new ObjectId(params.id)
  })

  return Response.json({ ok: true })
}