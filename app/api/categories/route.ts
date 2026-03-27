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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 25)
    const search = searchParams.get("search") || ""

    const client = await clientPromise
    const db = client.db("ecommerce")

    let query: any = { isActive: true }

    if (search) {
      const matched = await db.collection("categories")
        .find({ name: { $regex: search, $options: "i" } })
        .toArray()

      const paths = matched.map(c => c.path)

      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { path: { $in: paths.map(p => new RegExp(`^${p}`)) } }
      ]
    }

    const total = await db.collection("categories").countDocuments(query)

    const categories = await db.collection("categories")
      .find(query)
      .sort({ path:1, createdAt:1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // 🔥 FIX: populate parent thủ công
    const parentIds = categories
      .map(c => c.parent)
      .filter(Boolean)

    const parents = await db.collection("categories")
      .find({ _id: { $in: parentIds } })
      .toArray()

    const parentMap = Object.fromEntries(
      parents.map(p => [p._id.toString(), p])
    )

    const result = categories.map(cat => ({
      ...cat,
      parent: cat.parent
        ? parentMap[cat.parent.toString()]
        : null
    }))

    return NextResponse.json({
      data: result,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("ecommerce")

    const slug = slugify(body.name)

    // 🔥 check duplicate slug
    const exists = await db.collection("categories").findOne({ slug })
    if (exists) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 })
    }

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

    const result = await db.collection("categories").insertOne({
      name: body.name,
      slug,
      parent,
      level,
      path,
      properties: body.properties || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}