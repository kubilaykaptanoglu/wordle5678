import "server-only"


const DEV_SECRET = "dev-only-secret-not-for-production"

export function getSecret(): string {
  const fromEnv = process.env.GAME_SECRET?.trim()
  if (fromEnv && fromEnv.length >= 24) return fromEnv
  if (process.env.NODE_ENV === "production") {
    throw new Error("GAME_SECRET ortam değişkeni tanımlı değil.")
  }
  return DEV_SECRET
}
