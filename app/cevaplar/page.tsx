import type { Metadata } from "next"

import { pastDates } from "@/lib/archive"
import { answerFor } from "@/lib/game"
import { istanbulDate, istanbulLabel } from "@/lib/istanbul"
import { pageMetadata } from "@/lib/seo"
import { LENGTHS, parseHarfParam, type LetterLength } from "@/lib/types"
import { trUpper } from "@/lib/turkish"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type Props = { searchParams: Promise<{ harf?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { harf: raw } = await searchParams
  const harf = parseHarfParam(raw ?? "5") ?? 5
  const path = harf === 5 ? "/cevaplar" : `/cevaplar?harf=${harf}`
  return pageMetadata({
    title: `${harf} Harfli Geçmiş Cevaplar`,
    description: `${harf} harfli Kelime5678 geçmiş kelimeleri, gün gün. Bugünün kelimesi listede yoktur.`,
    path,
  })
}

export default async function AnswersPage({ searchParams }: Props) {
  const { harf: raw } = await searchParams
  const harf: LetterLength = parseHarfParam(raw ?? "5") ?? 5
  const today = istanbulDate()
  const rows = pastDates(today).map((date) => ({
    date,
    label: istanbulLabel(date),
    word: trUpper(answerFor(harf, date)),
  }))

  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${harf} harfli geçmiş cevaplar`,
    numberOfItems: rows.length,
    itemListElement: rows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${row.label}: ${row.word}`,
    })),
  }

  return (
    <main className="page">
      <a className="home-link" href="/">
        <span aria-hidden="true">←</span>
        Ana ekrana dön
      </a>
      <p className="kicker">Kelime5678</p>
      <h1>Geçmiş cevaplar</h1>
      <p className="lede">
        Bitmiş günlerin kelimeleri. Bugünün kelimesi bu listede yoktur; gece yarısından sonra eklenir.
      </p>
      <nav className="lengths" aria-label="Harf sayısı">
        {LENGTHS.map((item) => (
          <a
            key={item}
            href={item === 5 ? "/cevaplar" : `/cevaplar?harf=${item}`}
            aria-current={item === harf ? "page" : undefined}
          >
            {item} harf
          </a>
        ))}
      </nav>
      {rows.length === 0 ? (
        <p>Henüz bitmiş gün yok.</p>
      ) : (
        <table className="archive">
          <caption className="sr">{harf} harfli geçmiş kelimeler</caption>
          <thead>
            <tr>
              <th scope="col">Gün</th>
              <th scope="col">Kelime</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date}>
                <td>
                  <time dateTime={row.date}>{row.label}</time>
                </td>
                <td translate="no">{row.word}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(list) }} />
    </main>
  )
}
