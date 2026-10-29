import assert from "node:assert/strict"
import test from "node:test"

import { pastDates } from "../lib/archive.ts"

test("bugün arşivde yok, dün var", () => {
  const dates = pastDates("2026-10-29", "2026-10-01")
  assert.equal(dates[0], "2026-10-28")
  assert.equal(dates.at(-1), "2026-10-01")
  assert.equal(dates.includes("2026-10-29"), false)
})

test("başlangıç gününde arşiv boş", () => {
  assert.deepEqual(pastDates("2026-10-01", "2026-10-01"), [])
})
