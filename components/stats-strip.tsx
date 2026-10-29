"use client"

import { useEffect, useState } from "react"

import { readStats, type StatsBook } from "@/lib/stats"
import { LENGTHS } from "@/lib/types"

export function StatsStrip() {
  const [book, setBook] = useState<StatsBook | null>(null)

  useEffect(() => {
    setBook(readStats())
  }, [])

  if (!book || LENGTHS.every((harf) => book[harf].played === 0)) return null

  return (
    <p className="stats">
      {LENGTHS.filter((harf) => book[harf].played > 0).map((harf) => (
        <span key={harf}>
          {harf} harf · {book[harf].wins}/{book[harf].played}
          {book[harf].streak > 1 ? ` · seri ${book[harf].streak}` : ""}
        </span>
      ))}
    </p>
  )
}
