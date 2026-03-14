"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import Nav from "@/components/Nav"
import Layout from "@/components/Layout"
export default function Home() {
  const { data: session } = useSession()
  return <Layout>
    <div className="text-blue=900 flex justify-between">
      <h2>
        Hello {session?.user?.name} have a good day
      </h2> 
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>{session?.user?.name}
      </div>
      <button onClick={()=> signOut({ callbackUrl: "/" })}>Sign out</button>
      </div>
</Layout>
  
}