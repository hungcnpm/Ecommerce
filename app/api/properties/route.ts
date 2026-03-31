import clientPromise from "@/lib/mongodb"

export async function GET() {
  const db = (await clientPromise).db()

  const data = await db.collection("properties").aggregate([
    {
      $lookup: {
        from: "propertyvalues",
        localField: "_id",
        foreignField: "property",
        as: "values"
      }
    }
  ]).toArray()

  return Response.json(data)
}
export async function POST(req) {
  const db = (await clientPromise).db()
  const body = await req.json()

  const result = await db.collection("properties").insertOne({
    name: body.name,
    isVariant: body.isVariant || false,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  return Response.json({ insertedId: result.insertedId })
}

