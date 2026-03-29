import { Schema, model, models } from "mongoose"

const CategorySchema = new Schema({
  name: { type: String, required: true },

  slug: { type: String, required: true, unique: true, index: true },

  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
    index: true
  },

  level: { type: Number, default: 0 },

  // 🔥 đổi sang string path
  path: { type: String, index: true },

  isActive: { type: Boolean, default: true },

  properties: [
    {
      name: { type: String },
      skuPrefix: {rype: String},
      type: { type: String, enum: ["text", "select"], default: "text" },
      values: [{ type: String }],
      isFilterable: { type: Boolean, default: true }
    }
  ]

}, {
  timestamps: true
})

export const Category =
  models.Category || model("Category", CategorySchema)