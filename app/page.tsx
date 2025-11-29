"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return


    if (!session) {
      // Unauthenticated users can access the public report page
      router.replace("/report")
      return
    }


    const roles = (session.user?.roles as string[]) || []

    if (roles.includes("admin-role")) {
      console.log(session.user.roles)
      router.replace("/admin/dashboard")
    }  else if (roles.includes("employee-role")) {
      console.log(session.user.roles)

      router.replace("/employee")
    } else {
      router.replace("/report")
    }
  }, [session, status, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-xl font-bold">Redirecting to your dashboard...</div>
    </div>
  )
}