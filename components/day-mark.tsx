"use client"

import { useEffect, useState } from "react"

import { istanbulDate } from "@/lib/istanbul"
import { readStats, resultOn, type DayResult } from "@/lib/stats"
import type { LetterLength } from "@/lib/types"

export function DayMark({ harf }: { harf: LetterLength }) {
  const [mark, setMark] = useState<DayResult | null>(null)

  useEffect(() => {
    setMark(resultOn(readStats()[harf], istanbulDate()))
  }, [harf])

  if (mark === "won") {
    return (
      <span className="day-mark" role="img" aria-label="Bugünü bildin">
        🎉
      </span>
    )
  }
  if (mark === "lost") {
    return (
      <span className="day-mark" role="img" aria-label="Bugünü bilemedin">
        😢
      </span>
    )
  }
  return null
}
