import mongoose, { Schema, models } from "mongoose";

const OrderItemSchema = new Schema({
  productId: String,
  title: String,
  price: Number,
  quantity: Number,
  subtotal: Number,
});

const OrderSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,

  items: [OrderItemSchema],

  total: { type: Number, required: true },

  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order =
  models.Order || mongoose.model("Order", OrderSchema);