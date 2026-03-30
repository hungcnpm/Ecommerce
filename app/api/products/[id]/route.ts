import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getNextSKU, generateSKUEnterprise } from "@/lib/sku";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  // ✅ validate product id
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("ecommerce")

  const product = await db.collection("products").aggregate([
    {
      $match: { _id: new ObjectId(id) }
    },
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

  return NextResponse.json(product[0])
}

export async function PUT(req: Request, context: any) {
  const { id } = await context.params
  const body = await req.json()

  // ✅ validate product id
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  // ✅ validate category id (FIX LỖI CHÍNH)
  if (!body.category || !ObjectId.isValid(body.category)) {
    return NextResponse.json(
      { error: "Invalid category id" },
      { status: 400 }
    )
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
  const validProperties = (body.properties || []).map((p: any) => ({
    property: new ObjectId(p.property),
    value: p.value
  }));

  const prefix = category?.skuPrefix || "SKU";
  const variants = [];

  for (let v of body.variants || []) {
    if (!v.sku) {
      const newId = await getNextSKU(db);
      v.sku = generateSKUEnterprise(v.attributes, prefix, newId);
    }

    variants.push({
      ...v,
      price: Number(v.price),
      stock: Number(v.stock),
    });
  }

  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        images: body.images,
        category: categoryId, // ✅ dùng lại biến đã validate
        properties: validProperties, // ✅ dùng validated data
        brand: body.brand || "GEN", // 👈 thêm brand
        variants, 
        updatedAt: new Date(),
      },
    }
  );

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  // ✅ validate id
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("ecommerce")

  await db.collection("products").deleteOne({
    _id: new ObjectId(id),
  })

  return NextResponse.json({ success: true })
}

