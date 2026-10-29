"use client"

import { useEffect, useRef, useState } from "react"

import { Confetti } from "@/components/confetti"
import { istanbulShort } from "@/lib/istanbul"
import { recordResult } from "@/lib/stats"
import {
  MAX_GUESSES,
  type GameError,
  type LetterLength,
  type Mark,
  type PublicGuess,
  type PublicState,
} from "@/lib/types"
import { KEY_ROWS, normalizeGuess, trUpper } from "@/lib/turkish"

const MARK_LABEL: Record<Mark, string> = {
  correct: "doğru yer",
  present: "yanlış yer",
  absent: "yok",
}

const ERROR_TEXT: Record<GameError, string> = {
  short: "Harf sayısı eksik",
  invalid: "Yalnızca Türkçe harf kullan",
  unknown: "Bu kelime listede yok",
  duplicate: "Bu kelimeyi zaten denedin",
  done: "Bugünün oyunu bitti",
  rate: "Çok hızlı gidiyorsun, biraz bekle",
  bad: "İstek anlaşılamadı",
}

type ApiBody = {
  error: GameError | null
  state: PublicState | null
}

export function Game({ initial }: { initial: PublicState }) {
  const harf = initial.harf
  const [guesses, setGuesses] = useState(initial.guesses)
  const [status, setStatus] = useState(initial.status)
  const [answer, setAnswer] = useState(initial.answer)
  const [date, setDate] = useState(initial.date)
  const [current, setCurrent] = useState("")
  const [message, setMessage] = useState("")
  const [visibleMessage, setVisibleMessage] = useState(false)
  const [busy, setBusy] = useState(false)
  const [shake, setShake] = useState(false)
  const [flashRow, setFlashRow] = useState<number | null>(null)
  const [showEnd, setShowEnd] = useState(initial.status !== "playing")
  const lock = useRef(false)
  const recorded = useRef(false)
  const draftRef = useRef("")
  const stateRef = useRef({ guesses, status, busy, date })

  stateRef.current = { guesses, status, busy, date }

  useEffect(() => {
    if (status === "playing" || recorded.current) return
    recorded.current = true
    recordResult(harf, date, status === "won")
  }, [status, harf, date])

  useEffect(() => {
    if (status === "playing") return
    if (initial.status !== "playing") {
      setShowEnd(true)
      return
    }
    const timer = window.setTimeout(() => setShowEnd(true), 1100)
    return () => window.clearTimeout(timer)
  }, [status, initial.status])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      const onButton = (event.target as HTMLElement | null)?.closest("button")
      if (event.key === "Enter") {
        if (onButton) return
        event.preventDefault()
        void submit()
        return
      }
      if (event.key === "Backspace") {
        event.preventDefault()
        erase()
        return
      }
      if (event.key.length === 1) typeLetter(event.key)
    }

    const onPaste = (event: ClipboardEvent) => {
      const live = stateRef.current
      if (live.status !== "playing" || live.busy) return
      const norm = normalizeGuess(event.clipboardData?.getData("text") ?? "")
      if (!norm) return
      event.preventDefault()
      const next = Array.from(norm).slice(0, harf).join("")
      draftRef.current = next
      setCurrent(next)
    }

    window.addEventListener("keydown", onKey)
    window.addEventListener("paste", onPaste)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("paste", onPaste)
    }
  }, [harf])

  function typeLetter(raw: string) {
    const live = stateRef.current
    if (live.status !== "playing" || live.busy) return
    const norm = normalizeGuess(raw)
    if (!norm || Array.from(norm).length !== 1) return
    if (Array.from(draftRef.current).length >= harf) return
    draftRef.current += norm
    setCurrent(draftRef.current)
    setVisibleMessage(false)
  }

  function erase() {
    const live = stateRef.current
    if (live.status !== "playing" || live.busy) return
    draftRef.current = Array.from(draftRef.current).slice(0, -1).join("")
    setCurrent(draftRef.current)
  }

  async function submit() {
    const live = stateRef.current
    const draft = draftRef.current
    if (lock.current || live.status !== "playing" || live.busy) return
    if (Array.from(draft).length < harf) {
      fail("short")
      return
    }

    lock.current = true
    setBusy(true)
    try {
      const response = await fetch(`/api/oyun/${harf}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: draft }),
      })
      const data = (await response.json()) as ApiBody
      if (data.state) {
        const previous = live.guesses.length
        setGuesses(data.state.guesses)
        setStatus(data.state.status)
        setAnswer(data.state.answer)
        setDate(data.state.date)
        if (!data.error && data.state.guesses.length > previous) {
          setFlashRow(data.state.guesses.length - 1)
          draftRef.current = ""
          setCurrent("")
        }
      }
      if (data.error) {
        fail(data.error === "short" ? "short" : data.error)
      } else if (data.state?.status === "won") {
        announce("Harikasın!", false)
      } else if (data.state?.status === "lost") {
        announce("Maalesef Bulamadın!", false)
      } else {
        announce("Tahmin işlendi", false)
      }
    } catch {
      fail("bad")
      setMessage("Bağlantı kurulamadı")
    } finally {
      lock.current = false
      setBusy(false)
    }
  }

  function fail(code: GameError) {
    const text = code === "short" ? `${harf} harf gir` : ERROR_TEXT[code]
    announce(text, true)
    setShake(true)
    window.setTimeout(() => setShake(false), 420)
  }

  function announce(text: string, visible: boolean) {
    setMessage(text)
    setVisibleMessage(visible)
  }

  const keys = keyColors(guesses)
  const rows = Array.from({ length: MAX_GUESSES }, (_, row) => {
    const guess = guesses[row]
    if (guess) return { letters: Array.from(guess.word), marks: guess.marks, pending: false }
    if (row === guesses.length && status === "playing") {
      return { letters: Array.from(current), marks: [] as Mark[], pending: true }
    }
    return { letters: [] as string[], marks: [] as Mark[], pending: false }
  })

  return (
    <div className={showEnd ? "play done" : "play"}>
      <header className="bar">
        <a className="back" href="/">
          Panel
        </a>
        <h1>{harf} harfli kelime</h1>
        <time className="when" dateTime={date}>
          {istanbulShort(date)}
        </time>
      </header>

      <div className="stage">
        <div className="grid" style={{ ["--cols" as string]: harf }} translate="no" aria-label="Tahmin tablosu">
          {rows.map((row, rowIndex) => (
            <div
              className={rowIndex === guesses.length && shake ? "row shake" : "row"}
              style={{ ["--cols" as string]: harf }}
              key={rowIndex}
            >
              {Array.from({ length: harf }, (_, index) => {
                const letter = row.letters[index] ?? ""
                const mark = row.marks[index]
                const reveal = flashRow === rowIndex && mark
                return (
                  <div
                    key={index}
                    className={["tile", letter ? "filled" : "", mark ?? "", reveal ? "reveal" : ""]
                      .filter(Boolean)
                      .join(" ")}
                    style={{ ["--i" as string]: index }}
                    aria-label={letter ? `${trUpper(letter)}${mark ? `, ${MARK_LABEL[mark]}` : ""}` : "boş"}
                  >
                    {letter ? (row.pending ? <span className="glyph">{trUpper(letter)}</span> : trUpper(letter)) : null}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <p className={visibleMessage ? "msg bad" : "msg sr"} role="status" aria-live="polite">
        {message}
      </p>

      {status === "playing" ? (
        <div className="kb" aria-label="Türkçe klavye">
          {KEY_ROWS.slice(0, 2).map((row, rowIndex) => (
            <div className={rowIndex === 1 ? "kb-row mid" : "kb-row"} key={row.join("")}>
              {row.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`key ${keys[key] ?? ""}`}
                  onClick={() => typeLetter(key)}
                  disabled={busy}
                  aria-label={trUpper(key)}
                >
                  {trUpper(key)}
                </button>
              ))}
            </div>
          ))}
          <div className="kb-row">
            <button type="button" className="key wide" onClick={erase} disabled={busy} aria-label="Sil">
              Sil
            </button>
            {KEY_ROWS[2].map((key) => (
              <button
                key={key}
                type="button"
                className={`key ${keys[key] ?? ""}`}
                onClick={() => typeLetter(key)}
                disabled={busy}
                aria-label={trUpper(key)}
              >
                {trUpper(key)}
              </button>
            ))}
            <button
              type="button"
              className={Array.from(current).length === harf ? "key wide enter ready" : "key wide enter"}
              onClick={() => void submit()}
              disabled={busy}
              aria-label="Gir"
            >
              Gir
            </button>
          </div>
        </div>
      ) : showEnd ? (
        <section className="end" aria-label="Oyun sonucu">
          {status === "won" ? <Confetti /> : null}
          <h2>{status === "won" ? "Harikasın!" : "Maalesef Bulamadın!"}</h2>
          {status === "won" && answer ? (
            <p className="end-word" translate="no">
              {trUpper(answer)}
            </p>
          ) : (
            <p className="end-note">Yarın cevaba bakabilirsin.</p>
          )}
          <a className="end-link" href={`/cevaplar?harf=${harf}`}>
            Tüm cevaplar
          </a>
        </section>
      ) : null}
    </div>
  )
}

function keyColors(guesses: PublicGuess[]): Record<string, Mark> {
  const rank: Record<Mark, number> = { absent: 1, present: 2, correct: 3 }
  const colors: Record<string, Mark> = {}
  for (const guess of guesses) {
    Array.from(guess.word).forEach((letter, index) => {
      const mark = guess.marks[index]
      if (!mark) return
      if (!colors[letter] || rank[mark] > rank[colors[letter]]) colors[letter] = mark
    })
  }
  return colors
}
