import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function requireRole(roles: string[]) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error("Unauthorized")
  }

  if (!roles.includes(session.user.role)) {
    throw new Error("Forbidden")
  }

  return session
}