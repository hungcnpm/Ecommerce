import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getNextSKU, generateSKUProMax } from "@/lib/sku";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid product id" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("ecommerce");

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
    },
    // 🔥 attributes → property
    {
      $lookup: {
        from: "properties",
        localField: "attributes.property",
        foreignField: "_id",
        as: "propertyDetails"
      }
    },
    // 🔥 attributes → value
    {
      $lookup: {
        from: "propertyvalues",
        localField: "attributes.value",
        foreignField: "_id",
        as: "valueDetails"
      }
    },
    // 🔥 variants
    {
      $lookup: {
        from: "variants",
        localField: "_id",
        foreignField: "product",
        as: "variants"
      }
    }
  ]).toArray();

  return NextResponse.json(product[0]);
}

export async function PUT(req: Request, context: any) {
  const { id } = await context.params;
  const body = await req.json();

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid product id" },
      { status: 400 }
    );
  }

  if (!body.category || !ObjectId.isValid(body.category)) {
    return NextResponse.json(
      { error: "Invalid category id" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const categoryId = new ObjectId(body.category);

  const category = await db.collection("categories").findOne({
    _id: categoryId
  });

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 400 }
    );
  }
  // 🔥 attributes
  const validAttributes = (body.attributes || []).map((a: any) => ({
    property: new ObjectId(a.property),
    value: new ObjectId(a.value)
  }));
  const properties = await db.collection("properties").find({
    _id: { $in: category.properties.map((id: string) => new ObjectId(id)) }
  }).toArray();
  const variantProps = properties.filter(p => p.isVariant);
  // ❗ nếu có variantProps mà không có variants → lỗi
  if (variantProps.length > 0 && (!body.variants || body.variants.length === 0)) {
    return NextResponse.json(
      { error: "Variants required for this category" },
      { status: 400 }
    );
  }
  const hasVariant = variantProps.length > 0;
  if (!hasVariant) {
    // 🔥 XÓA variant cũ trong DB
    await db.collection("variants").deleteMany({
      product: new ObjectId(id),
    });
    body.variants = [];
    if (!body.price || isNaN(Number(body.price))) {
      throw new Error("Invalid price");
    }
  }
  // 🔥 update product
  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: body.title,
        description: body.description,
        ...(hasVariant ? {} : { price: Number(body.price) }),

        minPrice: 0,
        maxPrice: 0,
        images: body.images,
        brand: body.brand || "GEN",
        category: categoryId,
        attributes: validAttributes,
        updatedAt: new Date(),
      },
    }
  );
  function normalizeAttributes(attrs: any[]) {
    return attrs.sort((a, b) =>
      a.property.toString().localeCompare(b.property.toString())
    );
  }
  // 🔥 reset variants
  await db.collection("variants").deleteMany({
    product: new ObjectId(id)
  });

  const newVariants = [];

  for (let v of body.variants || []) {
    const skuId = await getNextSKU(db);
  
    // ✅ VALIDATE ATTRIBUTE ĐỦ
    if (variantProps.length > 0) {
      if ((v.attributes || []).length !== variantProps.length) {
        throw new Error("Variant thiếu thuộc tính");
      }
      
      for (let prop of variantProps) {
        const found = v.attributes.find(
          (a: any) => a.property === prop._id.toString()
        );
      
        if (!found) {
          throw new Error(`Variant thiếu thuộc tính ${prop.name}`);
        }
      }
    }
  
    // ✅ MAP (KHÔNG FILTER)
    let attrs = (v.attributes || []).map((a: any) => {
      if (!ObjectId.isValid(a.property) || !ObjectId.isValid(a.value)) {
        throw new Error("Invalid ObjectId");
      }
    
      return {
        property: new ObjectId(a.property),
        value: new ObjectId(a.value),
      };
    });
    attrs = normalizeAttributes(attrs);
  
    const variantKey = attrs
      .map(a => `${a.property}:${a.value}`)
      .join("|");
  
    const exists = await db.collection("variants").findOne({
      product: new ObjectId(id),
      variantKey,
    });
  
    if (exists) {
      throw new Error("Duplicate variant");
    }
  
    newVariants.push({
      product: new ObjectId(id),
      attributes: attrs,
      sku: generateSKUProMax(
        attrs,
        category.skuPrefix || "SKU",
        body.brand || "GEN",
        skuId
      ),
      price: Number(v.price),
      stock: Number(v.stock),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  if (newVariants.length > 0) {
    await db.collection("variants").insertMany(newVariants);
  }
  if (newVariants.length > 0) {
    const prices = newVariants.map(v => v.price);
  
    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          price: hasVariant?"":Number(body.price),
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
        },
      }
    );
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: "Invalid product id" },
      { status: 400 }
    );
  }

  const client = await clientPromise;
  const db = client.db("ecommerce");

  await db.collection("products").deleteOne({
    _id: new ObjectId(id),
  });

  // 🔥 xoá luôn variants
  await db.collection("variants").deleteMany({
    product: new ObjectId(id)
  });

  return NextResponse.json({ success: true });
}
