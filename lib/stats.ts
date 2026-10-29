import { shiftIsoDate } from "./istanbul"
import type { LetterLength } from "./types"

const KEY = "kelime5678-stats-v1"

export type ModeStats = {
  played: number
  wins: number
  streak: number
  maxStreak: number
  lastDate: string | null
}

export type StatsBook = Record<LetterLength, ModeStats>

function empty(): ModeStats {
  return { played: 0, wins: 0, streak: 0, maxStreak: 0, lastDate: null }
}

function emptyBook(): StatsBook {
  return { 5: empty(), 6: empty(), 7: empty(), 8: empty() }
}

export function readStats(): StatsBook {
  if (typeof window === "undefined") return emptyBook()
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return emptyBook()
    const parsed = JSON.parse(raw) as Partial<StatsBook>
    const book = emptyBook()
    for (const harf of [5, 6, 7, 8] as const) {
      const row = parsed[harf]
      if (!row) continue
      book[harf] = {
        played: Number(row.played) || 0,
        wins: Number(row.wins) || 0,
        streak: Number(row.streak) || 0,
        maxStreak: Number(row.maxStreak) || 0,
        lastDate: typeof row.lastDate === "string" ? row.lastDate : null,
      }
    }
    return book
  } catch {
    return emptyBook()
  }
}

export function recordResult(harf: LetterLength, date: string, won: boolean): StatsBook {
  const book = readStats()
  const row = book[harf]
  if (row.lastDate === date) return book

  const continued = row.lastDate === shiftIsoDate(date, -1)
  const streak = won ? (continued ? row.streak + 1 : 1) : 0
  book[harf] = {
    played: row.played + 1,
    wins: row.wins + (won ? 1 : 0),
    streak,
    maxStreak: Math.max(row.maxStreak, streak),
    lastDate: date,
  }
  window.localStorage.setItem(KEY, JSON.stringify(book))
  return book
}
