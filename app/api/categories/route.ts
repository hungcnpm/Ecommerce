import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/đ/g, "d") // 🔥 FIX QUAN TRỌNG
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "") // 🔥 không dùng \w
    .trim()
    .replace(/\s+/g, "-")
}
 
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 25)
    const search = searchParams.get("search") || ""

    const client = await clientPromise
    const db = client.db("ecommerce")

    function normalizeVietnamese(str: string) {
      return str
        .toLowerCase()
        .replace(/đ/g, "d") // 🔥 bắt buộc
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/[^a-z0-9\s]/g, "") // bỏ ký tự đặc biệt
        .replace(/\s+/g, " ") // chuẩn hóa khoảng trắng
        .trim()
    }
    // if (!search) {
    //   return NextResponse.json({
    //     data: [],  
    //     total: 0,
    //     page,
    //     totalPages: 0
    //   })
    // }
    let query: any = {}

    function escapeRegex(str: string) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    if (search) {
      const keyword = normalizeVietnamese(search)
      const regex = new RegExp(keyword.split(" ").join(".*"), "i")
    
      // 🔥 Step 1: tìm category match name
      const matched = await db.collection("categories")
        .find({ name_normalized: { $regex: `.*${keyword}.*`, $options: "i" } })
        .project({ path: 1 })
        .toArray()
    
      // ❌ không có match → trả rỗng luôn (FIX BUG)
      if (matched.length === 0) {
        return NextResponse.json({
          data: [],
          total: 0,
          page,
          totalPages: 0
        })
      }
    
      // 🔥 Step 2: build regex từ path
      const pathRegex = new RegExp(
        `^(${matched.map(c =>
          escapeRegex(c.path)
        ).join("|")})(/|$)`
      )
    
      // 🔥 Query cuối cùng (CHỈ 1 điều kiện)
      query = {
        $or: [
          { name_normalized: regex },
          { path: pathRegex }
        ]
      }
    }

    const total = await db.collection("categories").countDocuments(query)

    const categories = await db.collection("categories")
      .find(query)
      .sort({ path: 1, createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // 🔥 populate parent
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
    function normalizeVietnamese(str: string) {
      return str
        .toLowerCase()
        .replace(/đ/g, "d") // 🔥 bắt buộc
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/[^a-z0-9\s]/g, "") // bỏ ký tự đặc biệt
        .replace(/\s+/g, " ") // chuẩn hóa khoảng trắng
        .trim()
    }
    const client = await clientPromise
    const db = client.db("ecommerce")

    const slug = slugify(body.name)
    const name_normalized = normalizeVietnamese(body.name)
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
      name_normalized,
      slug,
      parent,
      level,
      path,
      properties: body.properties || [],
      isActive: body.isActive||true,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(result)

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}