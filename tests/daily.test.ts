import assert from "node:assert/strict"
import test from "node:test"

import { dailyIndex } from "../lib/daily.ts"

test("aynı gün aynı indeks, aralık içinde", () => {
  const secret = "test-secret-uzun-anahtar"
  const first = dailyIndex("2026-10-29", 5, 1891, secret)
  assert.equal(first, dailyIndex("2026-10-29", 5, 1891, secret))
  assert.ok(first >= 0 && first < 1891)
  assert.notEqual(first, dailyIndex("2026-10-30", 5, 1891, secret))
  assert.notEqual(first, dailyIndex("2026-10-29", 6, 1891, secret))
})
