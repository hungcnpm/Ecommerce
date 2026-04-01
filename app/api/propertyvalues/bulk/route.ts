import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(req) {
  const db = (await clientPromise).db()
  const body = await req.json()

  const propertyId = new ObjectId(body.propertyId)

  const existing = await db.collection("propertyvalues")
    .find({ property: propertyId })
    .toArray()

  const existingValues = existing.map(v => v.value)

  const incomingValues = body.values

  // 🔥 values cần thêm
  const toAdd = incomingValues.filter(v => !existingValues.includes(v))

  // 🔥 values cần xoá
  const toDelete = existingValues.filter(v => !incomingValues.includes(v))

  if (toAdd.length) {
    await db.collection("propertyvalues").insertMany(
      toAdd.map(v => ({
        property: propertyId,
        value: v,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  }

  if (toDelete.length) {
    await db.collection("propertyvalues").deleteMany({
      property: propertyId,
      value: { $in: toDelete }
    })
  }

  return Response.json({ ok: true })
}

