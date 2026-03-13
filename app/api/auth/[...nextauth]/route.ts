import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }