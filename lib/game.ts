import "server-only"

import { dailyIndex } from "./daily"
import { attempt, viewGame } from "./engine"
import { formatCount, istanbulDate, istanbulLabel } from "./istanbul"
import { getSecret } from "./secret"
import { readPayload, signPayload } from "./token"
import {
  MAX_GUESSES,
  type GameError,
  type LetterLength,
  type PublicState,
  type StoredGame,
} from "./types"
import { answerList, guessSet, wordCount } from "./words"

export function answerFor(harf: LetterLength, date = istanbulDate()): string {
  const list = answerList(harf)
  return list[dailyIndex(date, harf, list.length, getSecret())] ?? ""
}

export function countsFor(harf: LetterLength): { count: number; label: string } {
  const count = wordCount(harf)
  return { count, label: formatCount(count) }
}

function guessesFromCookie(
  token: string | undefined,
  harf: LetterLength,
  date: string,
  allowed: Set<string>,
): string[] {
  if (!token || token.length > 2048) return []
  const parsed = readPayload(token, getSecret())
  if (!parsed || parsed.harf !== harf || parsed.date !== date) return []
  const valid = parsed.guesses.every(
    (guess) => Array.from(guess).length === harf && allowed.has(guess),
  )
  return valid ? parsed.guesses : []
}

export function present(harf: LetterLength, guesses: string[], date = istanbulDate()): PublicState {
  const answer = answerFor(harf, date)
  return {
    ...viewGame(guesses, answer),
    harf,
    date,
    dateLabel: istanbulLabel(date),
    maxGuesses: MAX_GUESSES,
    wordCount: wordCount(harf),
  }
}

export function readGame(harf: LetterLength, token: string | undefined): PublicState {
  const date = istanbulDate()
  const guesses = guessesFromCookie(token, harf, date, guessSet(harf))
  return present(harf, guesses, date)
}

export function playGuess(
  harf: LetterLength,
  token: string | undefined,
  rawGuess: string,
): { state: PublicState; error: GameError | null; cookie: string | null } {
  const date = istanbulDate()
  const allowed = guessSet(harf)
  const guesses = guessesFromCookie(token, harf, date, allowed)
  const answer = answerFor(harf, date)
  const next = attempt({ guesses, harf, answer, allowed, rawGuess })
  const state = present(harf, next.guesses, date)
  if (next.error || next.guesses.length === guesses.length) {
    return { state, error: next.error, cookie: null }
  }

  const payload: StoredGame = { v: 1, date, harf, guesses: next.guesses }
  return { state, error: null, cookie: signPayload(payload, getSecret()) }
}

export function cookieName(harf: LetterLength): string {
  return `k5678_${harf}`
}
