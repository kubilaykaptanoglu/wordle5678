import type { Mark } from "./types"

export function score(guess: string, answer: string): Mark[] {
  const guessChars = Array.from(guess)
  const answerChars = Array.from(answer)
  if (guessChars.length !== answerChars.length) {
    throw new Error("Uzunluklar uyuşmuyor")
  }

  const marks: Mark[] = Array.from({ length: guessChars.length }, () => "absent")
  const pool: string[] = []

  for (let index = 0; index < guessChars.length; index += 1) {
    if (guessChars[index] === answerChars[index]) {
      marks[index] = "correct"
    } else {
      pool.push(answerChars[index] ?? "")
    }
  }

  for (let index = 0; index < guessChars.length; index += 1) {
    if (marks[index] === "correct") continue
    const at = pool.indexOf(guessChars[index] ?? "")
    if (at === -1) continue
    marks[index] = "present"
    pool.splice(at, 1)
  }

  return marks
}
