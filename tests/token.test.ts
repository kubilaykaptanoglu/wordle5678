import assert from "node:assert/strict"
import test from "node:test"

import { readPayload, signPayload } from "../lib/token.ts"

const secret = "cok-gizli-ve-uzun-bir-anahtar"

test("imza bozulursa çerez okunmaz", () => {
  const token = signPayload({ v: 1, date: "2026-10-29", harf: 5, guesses: ["kalem"] }, secret)
  const parsed = readPayload(token, secret)
  assert.equal(parsed?.guesses[0], "kalem")

  const [body, signature] = token.split(".")
  const flipped = `${body?.slice(0, -1)}${body?.endsWith("a") ? "b" : "a"}.${signature}`
  assert.equal(readPayload(flipped, secret), null)
  assert.equal(readPayload(token, "baska-uzun-bir-gizli-anahtar"), null)
})
