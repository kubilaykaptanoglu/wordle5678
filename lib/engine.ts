import { score } from "./score"
import { MAX_GUESSES, type EngineView, type GameError, type LetterLength } from "./types"
import { normalizeGuess } from "./turkish"

export type EngineError = Exclude<GameError, "rate" | "bad">

export function viewGame(guesses: string[], answer: string): EngineView {
  const scored = guesses.map((word) => ({ word, marks: score(word, answer) }))
  const won = guesses.some((word) => word === answer)
  const status = won ? "won" : guesses.length >= MAX_GUESSES ? "lost" : "playing"
  return {
    guesses: scored,
    status,
    answer: status === "won" ? answer : null,
  }
}

export function attempt(options: {
  guesses: string[]
  harf: LetterLength
  answer: string
  allowed: Set<string>
  rawGuess: string
}): { guesses: string[]; error: EngineError | null } {
  const norm = normalizeGuess(options.rawGuess)
  if (!norm) return { guesses: options.guesses, error: "invalid" }

  const length = Array.from(norm).length
  if (length < options.harf) return { guesses: options.guesses, error: "short" }
  if (length > options.harf) return { guesses: options.guesses, error: "invalid" }

  const current = viewGame(options.guesses, options.answer)
  if (current.status !== "playing") return { guesses: options.guesses, error: "done" }
  if (!options.allowed.has(norm)) return { guesses: options.guesses, error: "unknown" }
  if (options.guesses.includes(norm)) return { guesses: options.guesses, error: "duplicate" }

  return { guesses: [...options.guesses, norm], error: null }
}
