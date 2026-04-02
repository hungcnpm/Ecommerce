import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireRole } from "@/lib/rbac";
import { getNextSKU, generateSKUProMax } from "@/lib/sku";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";

  const skip = (page - 1) * limit;

  const client = await clientPromise;
  const db = client.db("ecommerce");

  // 🔍 SEARCH
  const query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  // 🔥 SORT
  let sortQuery: any = { createdAt: -1 };

  if (sort === "price_asc") {
    sortQuery = { minPrice: 1 };
  }
  if (sort === "price_desc") {
    sortQuery = { minPrice: -1 };
  }
  if (sort === "name") {
    sortQuery = { title: 1 };
  }

  // 🔥 QUERY SONG SONG
  const [products, total] = await Promise.all([
    db.collection("products")
      .aggregate([
        { $match: query },

        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "variants",
            localField: "_id",
            foreignField: "product",
            as: "variants",
          },
        },

        { $sort: sortQuery },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray(),

    db.collection("products").countDocuments(query),
  ]);

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
function normalizeAttributes(attrs: any[]) {
  return attrs.sort((a, b) =>
    a.property.toString().localeCompare(b.property.toString())
  );
}
export async function POST(req: Request) {
  try {
    await requireRole(["admin"]);
    const body = await req.json();

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

    // 🔥 VALIDATE BASIC
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

    // 🔥 CREATE PRODUCT
    const productRes = await db.collection("products").insertOne({
      title: body.title,
      description: body.description,
      price: hasVariant ? null : Number(body.price),
      minPrice: 0,
      maxPrice: 0,
      brand: body.brand || "GEN",
      images: body.images,
      category: categoryId,
      attributes: validAttributes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const productId = productRes.insertedId;

    // 🔥 VARIANTS
    const variants = [];
    const seen = new Set();

    for (let v of body.variants || []) {
      const skuId = await getNextSKU(db);

      // validate attributes
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

      // validate price/stock
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

      variants.push({
        product: productId,
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

    if (variants.length > 0) {
      await db.collection("variants").insertMany(variants);
    }

    // 🔥 PRICE LOGIC
    if (hasVariant && variants.length > 0) {
      const prices = variants.map((v) => v.price);

      await db.collection("products").updateOne(
        { _id: productId },
        {
          $set: {
            price: null,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
          },
        }
      );
    }

    return NextResponse.json({ success: true });

  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 400 }
    );
  }
}
