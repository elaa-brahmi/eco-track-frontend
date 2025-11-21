import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"

export async function middleware(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    const url = new URL(request.url)

    if (url.pathname.startsWith("/api/proxy")) {
      const apiUrl = url.pathname.replace("/api/proxy", "")

      // Fix 2: Clone the request to read body safely (FormData fix)
      const requestClone = request.clone()
      const contentType = request.headers.get("content-type") || ""

      const headers: Record<string, string> = {}

      // NEVER override multipart boundary — let browser do it
      if (contentType.includes("multipart/form-data")) {
        // Don't set Content-Type → browser sets correct boundary
      } else {
        headers["Content-Type"] = contentType || "application/json"
      }

      // Add token if exists
      if (session?.accessToken) {
        headers["Authorization"] = `Bearer ${session.accessToken}`
      }

      // Fix 3: Pass body correctly for FormData
      const response = await fetch(`http://localhost:8080${apiUrl}`, {
        method: request.method,
        headers,
        body: request.body, // This now works with FormData
      })

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    }

    return NextResponse.next()
  } catch (error) {
    console.error("Middleware error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

export const config = {
  matcher: "/api/proxy/:path*",
}