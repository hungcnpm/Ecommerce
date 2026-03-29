import { MongoClient } from "mongodb"
import dotenv from 'dotenv';
dotenv.config();
console.log("MONGODB_URL:", process.env.MONGODB_URL);
const uri = process.env.MONGODB_URL
if (!uri) {
    throw new Error("Thiếu MONGO_URI trong .env");
}
const client = new MongoClient(uri)

const clientPromise = client.connect()

export default clientPromise