import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/rbac"
export async function GET() {
  const client = await clientPromise
  const db = client.db("ecommerce")

  const products = await db.collection("orders").find({}).toArray()

  return NextResponse.json(products)
}
