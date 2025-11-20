import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const url = new URL(request.url)

  // Only proxy requests that go to Spring Boot
  if (url.pathname.startsWith("/api/proxy")) {
    const apiUrl = url.pathname.replace("/api/proxy", "")

    const headers: Record<string, string> = {}
    headers["Content-Type"] = request.headers.get("content-type") || "application/json"
    if (token && (token as any).accessToken) {
      headers["Authorization"] = `Bearer ${(token as any).accessToken}`
    }

    const res = await fetch(`http://localhost:8080${apiUrl}`, {
      method: request.method,
      headers,
      body: request.body,
    })

    return new Response(res.body, { status: res.status })
  }

  return NextResponse.next()  // Let normal pages load
}

export const config = {
  matcher: "/api/proxy/:path*",
}