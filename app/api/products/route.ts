import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { requireRole } from "@/lib/rbac"
import { getNextSKU, generateSKUProMax } from "@/lib/sku"
export async function GET() {
  const client = await clientPromise
  const db = client.db("ecommerce")

  const products = await db.collection("products").aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true
      }
    }
  ]).toArray()

  return NextResponse.json(products)
}

export async function POST(req: Request) {
  try {
    await requireRole(["admin"])
    const body = await req.json()
    if (!body.variants || body.variants.length === 0) {
      body.variants = [
        {
          attributes: {},
          price: body.price,
          stock: 1,
        },
      ];
    }
    const client = await clientPromise
    const db = client.db("ecommerce")

    const categoryId = new ObjectId(body.category)

    // 🔥 lấy category
    const category = await db.collection("categories").findOne({
      _id: categoryId
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 })
    }

    // 🔥 validate properties
    const validProperties: any = {}

    for (const prop of category.properties || []) {
      const value = body.properties?.[prop.name]

      if (value) {
        if (prop.type === "select" && !prop.values.includes(value)) {
          return NextResponse.json(
            { error: `Invalid value for ${prop.name}` },
            { status: 400 }
          )
        }

        validProperties[prop.name] = value
      }
    }
    const prefix = category?.skuPrefix || "SKU";
    const brand = body.brand || "GEN"; // 👈 thêm brand
    const variants = [];

    for (let v of body.variants || []) {
      const existing = await db.collection("products").findOne({
        "variants.sku": v.sku
      });
      
      if (existing) {
        return NextResponse.json(
          { error: `Duplicate SKU: ${v.sku}` },
          { status: 400 }
        );
      }
      const id = await getNextSKU(db);

      variants.push({
        ...v,
        sku: generateSKUProMax(v.attributes, prefix, brand, id),
        price: Number(v.price),
        stock: Number(v.stock),
      });
    }
    
    const result = await db.collection("products").insertOne({
      title: body.title,
      description: body.description,
      price: Number(body.price),
      images: body.images,
      category: new ObjectId(body.category),
      properties: body.properties || {},
      variants,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(result)

  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: e.message === "Unauthorized" ? 401 : 403 }
    )
  }
}