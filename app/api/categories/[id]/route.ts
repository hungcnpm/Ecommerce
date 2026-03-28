import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const client = await clientPromise
  const db = client.db("ecommerce")

  const category = await db.collection("categories").findOne({
    _id: new ObjectId(id)
  })

  let parent = null

  if (category?.parent) {
    parent = await db.collection("categories").findOne({
      _id: category.parent
    })
  }

  return NextResponse.json({
    ...category,
    parent
  })
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()

    const client = await clientPromise
    const db = client.db("ecommerce")

    const slug = slugify(body.name)

    let parent = null
    let level = 0
    let path = slug

    if (body.parent) {
      const parentDoc = await db.collection("categories").findOne({
        _id: new ObjectId(body.parent)
      })

      if (!parentDoc) {
        return NextResponse.json({ error: "Parent not found" }, { status: 400 })
      }

      parent = parentDoc._id
      level = parentDoc.level + 1
      path = `${parentDoc.path}/${slug}`
    }

    await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: body.name,
          slug,
          parent,
          level,
          path,
          properties: body.properties || [],
          isActive: body.isActive ?? true,
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const client = await clientPromise
  const db = client.db("ecommerce")

  // 🔥 soft delete thay vì xoá
  await db.collection("categories").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        isActive: false,
        updatedAt: new Date()
      }
    }
  )

  return NextResponse.json({ success: true })
}