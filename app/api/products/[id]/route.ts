import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
  ) {
    const { id } = await context.params
  
    console.log("ID nhận được:", id)
    const client = await clientPromise
    const db = client.db("ecommerce")
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) })
  
    return NextResponse.json(product)
  }
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  const client = await clientPromise
  const db = client.db("ecommerce")

  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    { $set: body }
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

  await db.collection("products").deleteOne({
    _id: new ObjectId(id),
  })

  return NextResponse.json({ success: true })
}