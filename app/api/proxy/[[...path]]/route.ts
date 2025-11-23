import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  return proxyRequest(request)
}
export async function GET(request: NextRequest) {
  return proxyRequest(request)
}
export async function PUT(request: NextRequest) {
  return proxyRequest(request)
}
export async function DELETE(request: NextRequest) {
  return proxyRequest(request)
}
export async function PATCH(request: NextRequest) {
  return proxyRequest(request)
}

async function proxyRequest(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if(!session) {
    return new Response("Unauthorized", { status: 401 })
  }
  console.log("Proxying request with session:", session)

  const url = new URL(request.url)
  const backendPath = url.pathname.replace("/api/proxy", "")
  const backendUrl = `http://localhost:8080${backendPath}${url.search}`

  const headers = new Headers()

  const contentType = request.headers.get("content-type")
  if (contentType) {
    headers.set("Content-Type", contentType)
  }

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`)
  }

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: request.body,
    // @ts-ignore — required for FormData streaming
    duplex: "half",
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
}

export const dynamic = "force-dynamic"