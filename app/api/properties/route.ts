import clientPromise from "@/lib/mongodb"

export async function GET() {
  const db = (await clientPromise).db()
  const data = await db.collection("properties").find().toArray()
  return Response.json(data)
}

export async function POST(req) {
  const db = (await clientPromise).db()
  const body = await req.json()
  const doc = await db.collection("properties").insertOne(body)
  return Response.json(doc)
}