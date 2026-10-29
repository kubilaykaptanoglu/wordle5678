import assert from "node:assert/strict"
import test from "node:test"

import { normalizeGuess, trUpper } from "../lib/turkish.ts"

test("Türkçe büyük küçük harf", () => {
  assert.equal(trUpper("ıslak"), "ISLAK")
  assert.equal(trUpper("değil"), "DEĞİL")
  assert.equal(normalizeGuess("ISLAK"), "ıslak")
  assert.equal(normalizeGuess("DEĞİL"), "değil")
  assert.equal(normalizeGuess("Işık"), "ışık")
  assert.equal(normalizeGuess("  Şeker "), "şeker")
  assert.equal(normalizeGuess("abc1"), null)
  assert.equal(normalizeGuess("ka lem"), null)
})
