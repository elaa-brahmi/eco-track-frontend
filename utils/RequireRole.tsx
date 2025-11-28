"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RequireRole({ 
  roles, 
  children 
}: { 
  roles: string[]
  children: React.ReactNode 
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.replace("/unauthorized")
      return
    }

    const userRoles = session.user?.roles as string[] || []
    const hasRequiredRole = roles.some(role => userRoles.includes(role))

    if (!hasRequiredRole || userRoles.length===0 ) {
      router.replace("/unauthorized")
    }
  }, [session, status, router, roles])

  if (status === "loading" || !session) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const userRoles = session.user?.roles as string[] || []
  const hasRequiredRole = roles.some(role => userRoles.includes(role))

  if (!hasRequiredRole) {
    return null
  }

  return <>{children}</>
}