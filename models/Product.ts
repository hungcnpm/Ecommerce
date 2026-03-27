import { timeStamp } from "console"
import mongoose, { Schema, model, models } from "mongoose"

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  images: [String],
  category:{type:mongoose.Types.ObjectId,ref:"Category"},

  properties:{
    type:Object
  },

},{
  timestamps:true,
})

export const Product =
  models.Product || model("Product", ProductSchema)