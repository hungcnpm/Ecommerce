import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // dev cho dễ
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // 🔥 chạy khi login
    async signIn({ user }) {
      const client = await clientPromise;
      const db = client.db("ecommerce");

      const existingUser = await db.collection("users").findOne({
        email: user.email,
      });

      if (!existingUser) {
        await db.collection("users").insertOne({
          name: user.name,
          email: user.email,
          image: user.image,
          role:
            user.email === "chipchipdaam@gmail.com" ? "admin" : "user", // RBAC
          createdAt: new Date(),
        });
      }

      return true;
    },

    // 🔥 add role vào token
    async jwt({ token }) {
      if (!token.email) return token;

      const client = await clientPromise;
      const db = client.db("ecommerce");

      const dbUser = await db.collection("users").findOne({
        email: token.email,
      });

      if (dbUser) {
        token.role = dbUser.role;
        token.id = dbUser._id.toString();
      }

      return token;
    },

    // 🔥 trả về client
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/", // nếu bạn có custom login
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };