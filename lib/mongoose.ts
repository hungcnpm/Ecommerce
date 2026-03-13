import mongoose from "mongoose"

const MONGODB_URL = process.env.MONGODB_URL!

export default async function mongooseConnect() {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(MONGODB_URL)
}