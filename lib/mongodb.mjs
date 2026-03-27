import { MongoClient } from "mongodb"

const uri = "mongodb+srv://ecommerce:hung9xpro@cluster0.xpvthuf.mongodb.net/ecommerce?retryWrites=true&w=majority"

const client = new MongoClient(uri)

const clientPromise = client.connect()

export default clientPromise