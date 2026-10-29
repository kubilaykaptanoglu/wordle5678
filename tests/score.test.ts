import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { score } from "../lib/score.ts"

test("doğru yer ve tekrar eden harf", () => {
  assert.deepEqual(score("kalem", "kalem"), ["correct", "correct", "correct", "correct", "correct"])
  assert.deepEqual(score("aaaaa", "kalem"), ["absent", "correct", "absent", "absent", "absent"])
  assert.deepEqual(score("kakak", "kazak"), ["correct", "correct", "absent", "correct", "correct"])
})

test("ı ile i karışmaz", () => {
  assert.deepEqual(score("sılık", "ıslak"), ["present", "present", "correct", "absent", "correct"])
  assert.deepEqual(score("islak", "ıslak"), ["absent", "correct", "correct", "correct", "correct"])
})

test("işaret sayısı harf sayısını aşmaz", () => {
  const words = readFileSync(new URL("../data/guesses/5.txt", import.meta.url), "utf8")
    .trim()
    .split("\n")
    .slice(0, 40)

  for (let index = 0; index < words.length; index += 1) {
    const guess = words[index] ?? ""
    const answer = words[(index + 7) % words.length] ?? ""
    const marks = score(guess, answer)
    const guessChars = Array.from(guess)
    const answerChars = Array.from(answer)
    const count = (chars: string[], needle: string) => chars.filter((char) => char === needle).length

    guessChars.forEach((char, at) => {
      if (char === answerChars[at]) assert.equal(marks[at], "correct")
      else assert.notEqual(marks[at], "correct")
    })

    for (const char of new Set(guessChars)) {
      const marked = marks.filter((mark, at) => guessChars[at] === char && mark !== "absent").length
      assert.equal(marked, Math.min(count(guessChars, char), count(answerChars, char)))
    }
  }
})
