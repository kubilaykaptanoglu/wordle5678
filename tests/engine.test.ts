import assert from "node:assert/strict"
import test from "node:test"

import { attempt, viewGame } from "../lib/engine.ts"

const allowed = new Set(["kalem", "kelam", "elmas", "selam", "makas", "sakal", "kamet"])

test("oyun bitmeden cevap gizlenir", () => {
  const view = viewGame(["kelam"], "kalem")
  assert.equal(view.status, "playing")
  assert.equal(view.answer, null)
  assert.deepEqual(view.guesses[0]?.marks, ["correct", "present", "correct", "present", "correct"])
})

test("bilinince cevap açılır", () => {
  const view = viewGame(["kalem"], "kalem")
  assert.equal(view.status, "won")
  assert.equal(view.answer, "kalem")
})

test("altıncı yanlışta cevap gizli kalır, yedinci eklenmez", () => {
  const guesses = ["kelam", "elmas", "selam", "makas", "sakal", "kamet"]
  const lost = viewGame(guesses, "kalem")
  assert.equal(lost.status, "lost")
  assert.equal(lost.answer, null)

  const again = attempt({ guesses, harf: 5, answer: "kalem", allowed, rawGuess: "kalem" })
  assert.equal(again.error, "done")
  assert.equal(again.guesses.length, 6)
})

test("listede olmayan kelime hak yemez", () => {
  const result = attempt({ guesses: [], harf: 5, answer: "kalem", allowed, rawGuess: "zzzzz" })
  assert.equal(result.error, "unknown")
  assert.deepEqual(result.guesses, [])
})

test("kısa tahmin ve tekrar reddedilir", () => {
  assert.equal(attempt({ guesses: [], harf: 5, answer: "kalem", allowed, rawGuess: "kal" }).error, "short")
  const duplicate = attempt({ guesses: ["kelam"], harf: 5, answer: "kalem", allowed, rawGuess: "KELAM" })
  assert.equal(duplicate.error, "duplicate")
})
