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

  const client = await clientPromise;
  const db = client.db("ecommerce");

  const categoryId = new ObjectId(body.category);

  const category = await db.collection("categories").findOne({
    _id: categoryId,
  });

  if (!category) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 400 }
    );
  }

  const properties = await db.collection("properties")
    .find({
      _id: {
        $in: category.properties.map((id: string) => new ObjectId(id)),
      },
    })
    .toArray();

  const variantProps = properties.filter((p) => p.isVariant);
  const hasVariant = variantProps.length > 0;

  // 🔥 VALIDATE
  if (hasVariant && (!body.variants || body.variants.length === 0)) {
    throw new Error("Variants required");
  }

  if (!hasVariant) {
    if (!body.price || isNaN(Number(body.price))) {
      throw new Error("Invalid price");
    }
  }

  const validAttributes = (body.attributes || []).map((a: any) => ({
    property: new ObjectId(a.property),
    value: new ObjectId(a.value),
  }));

  // 🔥 UPDATE PRODUCT BASE
  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        title: body.title,
        description: body.description,
        brand: body.brand || "GEN",
        images: body.images,
        category: categoryId,
        attributes: validAttributes,
        updatedAt: new Date(),
      },
    }
  );

  // 🔥 RESET VARIANTS
  await db.collection("variants").deleteMany({
    product: new ObjectId(id),
  });

  const newVariants = [];
  const seen = new Set();

  for (let v of body.variants || []) {
    const skuId = await getNextSKU(db);

    if (variantProps.length > 0) {
      if ((v.attributes || []).length !== variantProps.length) {
        throw new Error("Variant thiếu thuộc tính");
      }

      for (let prop of variantProps) {
        const found = v.attributes.find(
          (a: any) =>
            a.property.toString() === prop._id.toString()
        );

        if (!found) {
          throw new Error(`Thiếu ${prop.name}`);
        }
      }
    }

    if (isNaN(Number(v.price)) || isNaN(Number(v.stock))) {
      throw new Error("Invalid price/stock");
    }

    let attrs = (v.attributes || []).map((a: any) => ({
      property: new ObjectId(a.property),
      value: new ObjectId(a.value),
    }));

    if (!attrs.length) throw new Error("Attributes empty");

    attrs.sort((a, b) =>
      a.property.toString().localeCompare(b.property.toString())
    );

    const variantKey = attrs
      .map((a) => `${a.property}:${a.value}`)
      .join("|");

    if (!variantKey) throw new Error("Invalid variantKey");

    if (seen.has(variantKey)) {
      throw new Error("Duplicate variant");
    }
    seen.add(variantKey);

    newVariants.push({
      product: new ObjectId(id),
      attributes: attrs,
      variantKey,
      sku: generateSKUProMax(
        attrs,
        category.skuPrefix || "SKU",
        body.brand || "GEN",
        skuId
      ),
      price: Number(v.price),
      stock: Number(v.stock),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  if (newVariants.length > 0) {
    await db.collection("variants").insertMany(newVariants);
  }

  // 🔥 PRICE LOGIC (FINAL)
  if (hasVariant && newVariants.length > 0) {
    const prices = newVariants.map((v) => v.price);

    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          price: null,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
        },
      }
    );
  } else {
    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          price: Number(body.price),
          minPrice: 0,
          maxPrice: 0,
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
