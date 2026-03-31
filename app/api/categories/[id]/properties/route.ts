import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req, { params }) {
  const { id } = await params

  const db = (await clientPromise).db()

  const category = await db.collection("categories").findOne({
    _id: new ObjectId(id)
  })

  if (!category) {
    return Response.json([], { status: 404 })
  }

  const props = await db.collection("properties").aggregate([
    {
      $match: {
        _id: {
          $in: (category.properties || []).map(
            (id: any) => new ObjectId(id)
          )
        },
        isDeleted: { $ne: true } // 🔥 ADD  
      }
    },
    // 🔥 JOIN propertyvalues
    {
      $lookup: {    
        from: "propertyvalues",
        let: { propId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$property", "$$propId"] },
                  { $ne: ["$isDeleted", true] } // 🔥 ADD
                ]
              }
            }
          }
        ],
        as: "values"
      }
    },
    {
      $project: {
        name: 1,
        isVariant: 1,
        values: {
          $map: {
            input: "$values",
            as: "v",
            in: {
              _id: "$$v._id",
              value: "$$v.value"
            }
          }
        }
      }
    }
  ]).toArray()

  return Response.json(props)
}

