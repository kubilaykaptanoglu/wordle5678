import { createHash } from "node:crypto"

export function dailyIndex(date: string, harf: number, size: number, secret: string): number {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("Boş kelime listesi")
  }
  const digest = createHash("sha256").update(`${secret}\n${date}\n${harf}`).digest()
  return digest.readUIntBE(0, 6) % size
}
