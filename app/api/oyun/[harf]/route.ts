import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { cookieName, playGuess } from "@/lib/game"
import { allowRequest, clientIp } from "@/lib/rate-limit"
import { parseHarfParam, type GameError } from "@/lib/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const bodySchema = z.object({
  guess: z.string().max(32),
})

function statusFor(error: GameError | null): number {
  if (!error) return 200
  if (error === "unknown") return 422
  if (error === "duplicate" || error === "done") return 409
  return 400
}

function secureCookie(request: NextRequest): boolean {
  const forwarded = request.headers.get("x-forwarded-proto")
  if (forwarded) return forwarded.split(",")[0]?.trim() === "https"
  return new URL(request.url).protocol === "https:"
}

export async function POST(request: NextRequest, context: { params: Promise<{ harf: string }> }) {
  const { harf: raw } = await context.params
  const harf = parseHarfParam(raw)
  if (!harf) {
    return NextResponse.json({ error: "bad", state: null }, { status: 404 })
  }

  if (!allowRequest(clientIp(request.headers))) {
    return NextResponse.json({ error: "rate", state: null }, { status: 429 })
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "bad", state: null }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: "bad", state: null }, { status: 400 })
  }

  const result = playGuess(harf, request.cookies.get(cookieName(harf))?.value, parsed.data.guess)
  const response = NextResponse.json(
    { error: result.error, state: result.state },
    { status: statusFor(result.error) },
  )

  if (result.cookie) {
    response.cookies.set(cookieName(harf), result.cookie, {
      httpOnly: true,
      sameSite: "lax",
      secure: secureCookie(request),
      path: "/",
      maxAge: 60 * 60 * 40,
    })
  }

  return response
}
