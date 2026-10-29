import "server-only"

import { readFileSync } from "node:fs"
import { join } from "node:path"

import { LENGTHS, type LetterLength } from "./types"
import { isWordLetter } from "./turkish"

type Bank = {
  guesses: Record<LetterLength, readonly string[]>
  guessSet: Record<LetterLength, Set<string>>
  answers: Record<LetterLength, readonly string[]>
}

let bank: Bank | null = null

function readWords(kind: "guesses" | "answers", harf: LetterLength): string[] {
  const file = join(process.cwd(), "data", kind, `${harf}.txt`)
  const words = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  for (const word of words) {
    const chars = Array.from(word)
    if (chars.length !== harf || chars.some((char) => !isWordLetter(char))) {
      throw new Error(`Kelime listesi bozuk: ${kind}/${harf}`)
    }
  }

  return words
}

function loadBank(): Bank {
  const guesses = {} as Bank["guesses"]
  const guessSet = {} as Bank["guessSet"]
  const answers = {} as Bank["answers"]

  for (const harf of LENGTHS) {
    const guessList = readWords("guesses", harf)
    const answerList = readWords("answers", harf)
    const allowed = new Set(guessList)
    if (answerList.some((word) => !allowed.has(word))) {
      throw new Error(`Cevap listesi tahmin listesinin dışında: ${harf}`)
    }
    guesses[harf] = guessList
    guessSet[harf] = allowed
    answers[harf] = answerList
  }

  return { guesses, guessSet, answers }
}

function getBank(): Bank {
  if (!bank) bank = loadBank()
  return bank
}

export function guessSet(harf: LetterLength): Set<string> {
  return getBank().guessSet[harf]
}

export function answerList(harf: LetterLength): readonly string[] {
  return getBank().answers[harf]
}

export function wordCount(harf: LetterLength): number {
  return getBank().guesses[harf].length
}
