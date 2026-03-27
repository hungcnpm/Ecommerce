// models/User.ts

import mongoose, { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  role: {
    type: String,
    enum: ["admin", "staff", "user", "editor"],
    default: "user",
  },
})

export const User = models.User || model("User", UserSchema)