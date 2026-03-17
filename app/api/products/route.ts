import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/rbac"
export async function GET() {
  const client = await clientPromise
  const db = client.db("ecommerce")

  const products = await db.collection("products").find({}).toArray()

  return NextResponse.json(products)
}

export async function POST(req: Request) {

  try {
    await requireRole(["admin"])
    const body = await req.json()

    const client = await clientPromise
    const db = client.db("ecommerce")

    const result = await db.collection("products").insertOne({
      title: body.title,
      description: body.description,
      price: body.price,
      images: body.images,
      category: body.category,
      properties: body.properties
    })

    return NextResponse.json(result)
  } catch (e:any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === "Unauthorized" ? 401 : 403 }
    )

  }
}