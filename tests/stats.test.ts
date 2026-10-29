import assert from "node:assert/strict"
import test from "node:test"

import { resultOn, type ModeStats } from "../lib/stats.ts"

function row(patch: Partial<ModeStats>): ModeStats {
  return {
    played: 1,
    wins: 0,
    streak: 0,
    maxStreak: 0,
    lastDate: "2026-10-29",
    lastWon: null,
    ...patch,
  }
}

test("bugün bilinmiş kutu konfeti ister", () => {
  assert.equal(resultOn(row({ lastWon: true, streak: 2, wins: 1 }), "2026-10-29"), "won")
})

test("bugün bilinememiş kutu üzgün surat ister", () => {
  assert.equal(resultOn(row({ lastWon: false }), "2026-10-29"), "lost")
})

test("eski kayıt seriye bakarak bugünü ayırır", () => {
  assert.equal(resultOn(row({ lastWon: null, streak: 3, wins: 1 }), "2026-10-29"), "won")
  assert.equal(resultOn(row({ lastWon: null, streak: 0 }), "2026-10-29"), "lost")
})

test("bitmemiş gün işaret istemez", () => {
  assert.equal(resultOn(row({ lastDate: "2026-10-28", lastWon: true }), "2026-10-29"), null)
})
