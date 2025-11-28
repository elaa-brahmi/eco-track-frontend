"use client"
import RequireRole from "@/utils/RequireRole"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const handleLogin = () => {
    signIn("keycloak", {
      callbackUrl: "/",        
      redirect: true
    })
  }
  return (

      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-10 rounded-xl shadow-xl text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-8">ecoTracker Tunisia</h1>
          <button
            onClick={handleLogin}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition"
          >
            Connect to ecoTracker
          </button>
          
        </div>
      </div>
  )
}