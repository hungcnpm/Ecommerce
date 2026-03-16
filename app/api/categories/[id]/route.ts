import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const client = await clientPromise
  const db = client.db("ecommerce")

  const category = await db
    .collection("categories")
    .findOne({ _id: new ObjectId(id) })

  return NextResponse.json(category)
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  const client = await clientPromise
  const db = client.db("ecommerce")

  await db.collection("categories").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: body.name,
        parent: body.parent ? new ObjectId(body.parent) : null,
        properties: body.properties || []
      }
    }
  )

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const client = await clientPromise
  const db = client.db("ecommerce")

  await db.collection("categories").deleteOne({
    _id: new ObjectId(id)
  })

  return NextResponse.json({ success: true })
}