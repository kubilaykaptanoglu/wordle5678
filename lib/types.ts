export const LENGTHS = [5, 6, 7, 8] as const
export const MAX_GUESSES = 6

export type LetterLength = (typeof LENGTHS)[number]
export type Mark = "correct" | "present" | "absent"
export type GameStatus = "playing" | "won" | "lost"

export type GameError =
  | "short"
  | "invalid"
  | "unknown"
  | "duplicate"
  | "done"
  | "rate"
  | "bad"

export type PublicGuess = {
  word: string
  marks: Mark[]
}

export type EngineView = {
  guesses: PublicGuess[]
  status: GameStatus
  answer: string | null
}

export type PublicState = EngineView & {
  harf: LetterLength
  date: string
  dateLabel: string
  maxGuesses: number
  wordCount: number
}

export type StoredGame = {
  v: 1
  date: string
  harf: LetterLength
  guesses: string[]
}

export function isLetterLength(value: number): value is LetterLength {
  return value === 5 || value === 6 || value === 7 || value === 8
}

export function parseHarfParam(value: string): LetterLength | null {
  if (value === "5" || value === "6" || value === "7" || value === "8") {
    return Number(value) as LetterLength
  }
  return null
}
