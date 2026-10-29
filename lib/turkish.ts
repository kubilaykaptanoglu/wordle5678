export const WORD_LETTERS = "abcçdefgğhıijklmnoöprsştuüvyz"
export const INPUT_LETTERS = `${WORD_LETTERS}qwx`

const WORD_SET = new Set(Array.from(WORD_LETTERS))
const INPUT_SET = new Set(Array.from(INPUT_LETTERS))

export function isWordLetter(char: string): boolean {
  return WORD_SET.has(char)
}

export function normalizeGuess(raw: string): string | null {
  const folded = raw.normalize("NFC").trim().toLocaleLowerCase("tr-TR")
  const chars = Array.from(folded)
  if (chars.length === 0 || chars.some((char) => !INPUT_SET.has(char))) {
    return null
  }
  return chars.join("")
}

export function trUpper(value: string): string {
  return Array.from(value)
    .map((char) => char.toLocaleUpperCase("tr-TR"))
    .join("")
}

export const KEY_ROWS = [
  ["e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
  ["z", "c", "v", "b", "n", "m", "ö", "ç"],
] as const
