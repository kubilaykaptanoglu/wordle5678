const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 90
const hits = new Map<string, number[]>()

export function allowRequest(key: string): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS)
  if (recent.length >= LIMIT) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) {
    for (const [id, stamps] of hits) {
      if (stamps.every((stamp) => now - stamp >= WINDOW_MS)) hits.delete(id)
    }
  }
  return true
}

export function clientIp(headerStore: Headers): string {
  const forwarded = headerStore.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0]?.trim().slice(0, 80) || "local"
  return headerStore.get("x-real-ip")?.slice(0, 80) || "local"
}
