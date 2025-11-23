"use client"
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider refetchInterval={60}>{children}</SessionProvider>
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.replace("/auth")
      return
    }

    if (session.error === "RefreshTokenError") {
      router.replace("/auth")
    }
  }, [session, status, router])

  if (status === "loading" || !session || session.error) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return <>{children}</>
}