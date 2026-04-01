import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(req, { params }) {
  const db = (await clientPromise).db()
  const id = new ObjectId(params.id)
  const now = new Date()
  const used = await db.collection("products").findOne({
    "attributes.property": id
  })
  
  if (used) {
    return Response.json({
      error: "Property is being used"
    }, { status: 400 })
  }
  // 🔥 soft delete property
  await db.collection("properties").updateOne(
    { _id: id },
    {
      $set: {
        isDeleted: true,
        deletedAt: now
      }
    }
  )

  // 🔥 soft delete property values
  await db.collection("propertyvalues").updateMany(
    { property: id },
    {
      $set: {
        isDeleted: true,
        deletedAt: now
      }
    }
  )

  // 🔥 remove khỏi categories (optional nhưng nên làm)
  await db.collection("categories").updateMany(
    { properties: id },
    { $pull: { properties: id } }
  )

  return Response.json({ ok: true })
}


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
