"use client"
import { signIn, signOut, useSession } from "next-auth/react"
import Nav from "@/components/Nav"

export default function Layout({children}) {
  const { data: session } = useSession()
  if(!session){
    return(
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center text-black w-full">
          <button onClick={()=> signIn('google')} className="bg-white"></button>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-blue-900 min-h-screen flex">
      <Nav/>
      <div className="bg-white flex-grow mt-2 mr-2 mb-0 rounded-lg p-4 text-black">{children}</div>
    </div>
  )
  
}