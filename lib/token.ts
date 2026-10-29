import { createHmac, timingSafeEqual } from "node:crypto"

import { z } from "zod"

import type { StoredGame } from "./types"

const storedSchema = z.object({
  v: z.literal(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  harf: z.union([z.literal(5), z.literal(6), z.literal(7), z.literal(8)]),
  guesses: z.array(z.string().min(5).max(8)).max(6),
})

export function signPayload(payload: StoredGame, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  const signature = createHmac("sha256", secret).update(body).digest("base64url")
  return `${body}.${signature}`
}

export function readPayload(token: string, secret: string): StoredGame | null {
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [body, signature] = parts
  if (!body || !signature) return null

  const expected = createHmac("sha256", secret).update(body).digest("base64url")
  const given = Buffer.from(signature)
  const wanted = Buffer.from(expected)
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null

  try {
    const json: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"))
    const parsed = storedSchema.safeParse(json)
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}
