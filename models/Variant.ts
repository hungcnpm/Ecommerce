import mongoose, { Schema, model, models } from "mongoose";

const VariantSchema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true
    },

    attributes: [
      {
        property: {
          type: mongoose.Types.ObjectId,
          ref: "Property",
          required: true
        },
        value: {
          type: mongoose.Types.ObjectId,
          ref: "PropertyValue",
          required: true
        }
      }
    ],

    sku: { type: String, required: true, unique: true },

    price: Number,
    stock: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Variant =
  models.Variant || model("Variant", VariantSchema);

