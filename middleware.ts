import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const lengths = new Set(["5", "6", "7", "8"])

export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/oyun\/([^/]+)\/?$/)
  if (!match || lengths.has(match[1] ?? "")) return NextResponse.next()
  return NextResponse.rewrite(new URL("/bulunamadi", request.url))
}

export const config = {
  matcher: ["/oyun/:length"],
}
