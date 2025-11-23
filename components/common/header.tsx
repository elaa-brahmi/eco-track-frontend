"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import LogoutButton from "./logoutButton"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Waste<span className="text-green-600">Flow</span>
          </h1>
        </Link>

        <div className="flex items-center space-x-4">
          {status === "loading" ? (
            <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse" />
          ) : session ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, <span className="font-semibold text-gray-900">{session.user?.name || "User"}</span>
              </span>
              <LogoutButton  />
            </div>
          ) : (
            <Link href="/auth">
              <button className="bg-[#0d1224] hover:bg-blue-900 text-white font-medium px-8 py-2 rounded-lg shadow-md transition">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}