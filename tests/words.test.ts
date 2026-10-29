import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { WORD_LETTERS } from "../lib/turkish.ts"

const alphabet = new Set(Array.from(WORD_LETTERS))
const order = Array.from(WORD_LETTERS)

function read(kind: "guesses" | "answers", harf: number): string[] {
  return readFileSync(new URL(`../data/${kind}/${harf}.txt`, import.meta.url), "utf8")
    .trim()
    .split("\n")
}

function rank(word: string): number[] {
  return Array.from(word).map((char) => order.indexOf(char))
}

for (const harf of [5, 6, 7, 8]) {
  test(`${harf} harf listeleri`, () => {
    const guesses = read("guesses", harf)
    const answers = read("answers", harf)
    assert.ok(guesses.length >= 2000, `tahmin ${guesses.length}`)
    assert.ok(answers.length >= 1000, `cevap ${answers.length}`)

    const allowed = new Set(guesses)
    for (const word of [...guesses, ...answers]) {
      assert.equal(Array.from(word).length, harf)
      assert.ok(Array.from(word).every((char) => alphabet.has(char)))
    }
    for (const word of answers) assert.ok(allowed.has(word))
    assert.equal(new Set(guesses).size, guesses.length)

    const sorted = [...guesses].sort((a, b) => {
      const left = rank(a)
      const right = rank(b)
      for (let index = 0; index < left.length; index += 1) {
        if (left[index] !== right[index]) return (left[index] ?? 0) - (right[index] ?? 0)
      }
      return 0
    })
    assert.deepEqual(guesses, sorted)
  })
}
