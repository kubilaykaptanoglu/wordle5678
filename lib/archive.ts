import { shiftIsoDate } from "./istanbul"

export const ARCHIVE_START = "2026-10-01"

export function pastDates(today: string, start = ARCHIVE_START): string[] {
  if (today <= start) return []
  const dates: string[] = []
  let cursor = shiftIsoDate(today, -1)
  while (cursor >= start && dates.length < 400) {
    dates.push(cursor)
    cursor = shiftIsoDate(cursor, -1)
  }
  return dates
}
