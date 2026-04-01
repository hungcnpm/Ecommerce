import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireRole } from "@/lib/rbac";
import { getNextSKU, generateSKUProMax } from "@/lib/sku";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("ecommerce");

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
    },
    // 🔥 populate attributes → property
    {
      $lookup: {
        from: "properties",
        localField: "attributes.property",
        foreignField: "_id",
        as: "propertyDetails"
      }
    },
    // 🔥 populate attributes → value
    {
      $lookup: {
        from: "propertyvalues",
        localField: "attributes.value",
        foreignField: "_id",
        as: "valueDetails"
      }
    }
  ]).toArray();

  return NextResponse.json(products);
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
    console.log("body", body);
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
    const properties = await db.collection("properties").find({
      _id: { $in: category.properties.map((id: string) => new ObjectId(id)) }
    }).toArray();
    const variantProps = properties.filter(p => p.isVariant);
    // 🔥 nếu CÓ variant props → bắt buộc phải có variants
    if (variantProps.length > 0 && (!body.variants || body.variants.length === 0)) {
      return NextResponse.json(
        { error: "Variants required for this category" },
        { status: 400 }
      );
    }
    console.log("variantProps:", variantProps.map(p => ({
      name: p.name,
      isVariant: p.isVariant
    })));
    const hasVariant = variantProps.length > 0;
    if (!hasVariant) {
      if (body.variants?.length > 0) {
        throw new Error("Simple product không cần variant");
      }
    
      if (!body.price || isNaN(Number(body.price))) {
        throw new Error("Invalid price");
      }
    }
    // 🔥 attributes chuẩn
    const validAttributes = (body.attributes || []).map((a: any) => ({
      property: new ObjectId(a.property),
      value: new ObjectId(a.value)
    }));
    // 🔥 create product
    const productRes = await db.collection("products").insertOne({
      title: body.title,
      description: body.description,
      ...(hasVariant ? {} : { price: Number(body.price) }),

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
     // 🔥 helper normalize
    
    // 🔥 create variants
    const variants = [];

    for (let v of body.variants || []) {
      const id = await getNextSKU(db);
    
      // ✅ VALIDATE ĐỦ ATTRIBUTE
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
    
      // ✅ MAP ATTRIBUTES
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
        .map((a) => `${a.property}:${a.value}`)
        .join("|");
      // ✅ CHECK DUPLICATE
      const exists = await db.collection("variants").findOne({
        product: productId,
        variantKey,
      });
      
      if (exists) {
        throw new Error("Duplicate variant in DB");
      }
      variants.push({
        product: productId,
        attributes: attrs,
        sku: generateSKUProMax(
          attrs,
          category.skuPrefix || "SKU",
          body.brand || "GEN",
          id
        ),
        price: Number(v.price),
        stock: Number(v.stock),
        variantKey:variantKey,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    if (variants.length > 0) {
      await db.collection("variants").insertMany(variants);
    }
    if (variants.length > 0) {
      const prices = variants.map(v => v.price);
    
      await db.collection("products").updateOne(
        { _id: productId },
        {
          $set: {
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
      { status: e.message === "Unauthorized" ? 401 : 403 }
    );
  }
}
