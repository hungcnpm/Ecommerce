import { Schema, model, models } from "mongoose"

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  images: [String],
})

export const Product =
  models.Product || model("Product", ProductSchema)