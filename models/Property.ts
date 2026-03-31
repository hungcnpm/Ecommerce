
import mongoose, { Schema, model, models } from "mongoose";

const PropertyValueSchema = new Schema(
  {
    property: {
      type: mongoose.Types.ObjectId,
      ref: "Property",
      required: true
    },

    value: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    slug: { type: String }
  },
  { timestamps: true }
);

export const PropertyValue =
  models.PropertyValue || model("PropertyValue", PropertyValueSchema);

