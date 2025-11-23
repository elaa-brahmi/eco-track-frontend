"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ 
            callbackUrl: "/", 
            redirect: true 
        })
        localStorage.removeItem("role")
    }
  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
    >
      Logout
    </button>
  )
}