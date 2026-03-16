import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET() {
  const client = await clientPromise
  const db = client.db("ecommerce")

  const categories = await db
    .collection("categories")
    .find({})
    .toArray()

  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const body = await req.json()

  const client = await clientPromise
  const db = client.db("ecommerce")

  const result = await db.collection("categories").insertOne({
    name: body.name,
    parent: body.parent ? new ObjectId(body.parent) : null,
    properties: body.properties || [],
    createdAt: new Date()
  })

  return NextResponse.json(result)
}