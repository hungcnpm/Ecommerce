import { timeStamp } from "console"
import mongoose, { Schema, model, models } from "mongoose"

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  images: [String],
  category:{type:mongoose.Types.ObjectId,ref:"Category"},
  brand: {type: String, default: "GEN" },
  properties:{
    type:Object
  },
  variants: [
    {
      attributes: Object,
      price: Number,
      stock: Number,
      sku: String
    }
  ]

},{
  timestamps:true,
})

export const Product =
  models.Product || model("Product", ProductSchema)