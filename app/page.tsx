import type { Metadata } from "next"

import { DayMark } from "@/components/day-mark"
import { Legend } from "@/components/legend"
import { StatsStrip } from "@/components/stats-strip"
import { Today } from "@/components/today"
import { formatCount } from "@/lib/istanbul"
import { pageMetadata } from "@/lib/seo"
import { LENGTHS } from "@/lib/types"
import { wordCount } from "@/lib/words"

export const metadata: Metadata = pageMetadata({
  absoluteTitle: "Kelime5678 — Günlük Türkçe Kelime Oyunu",
  description:
    "5, 6, 7 ve 8 harfli günlük Türkçe kelime oyunu. Uzunluğu seç, altı denemede günün kelimesini bul. Her gece yeni kelime.",
  path: "/",
})

export default function HomePage() {
  const counts = LENGTHS.map((harf) => {
    const count = wordCount(harf)
    return { harf, label: formatCount(count) }
  })

  return (
    <main className="page">
      <p className="kicker">Kelime5678</p>
      <h1>Günlük Türkçe kelime</h1>
      <p className="lede">
        5, 6, 7 veya 8 harfli günün kelimesini altı denemede bul. Kelime her gece 00:00&apos;da (Türkiye) değişir.
      </p>
      <Legend />

      <section className="panel" id="panel" aria-labelledby="panel-title">
        <div className="panel-head">
          <h2 id="panel-title">Oyun paneli</h2>
          <p>
            <Today />
          </p>
        </div>
        <div className="modes">
          {counts.map((mode) => (
            <a
              key={mode.harf}
              className="mode"
              href={`/oyun/${mode.harf}`}
              aria-label={`${mode.harf} harfli oyunu aç, ${mode.label} kelime`}
            >
              <DayMark harf={mode.harf} />
              <span className="num">{mode.harf}</span>
              <span>
                harf
                <small>{mode.label} kelime</small>
              </span>
            </a>
          ))}
        </div>
        <StatsStrip />
      </section>

      <article className="prose">
        <h2>Nasıl oynanır</h2>
        <p>
          Uzunluğu seç. Altı tahminin var. Yeşil doğru yer, sarı yanlış yer, gri kelimede yok. Sözlükte olmayan
          yazım deneme harcamaz. <span translate="no">ı</span> ile <span translate="no">i</span> ayrı harftir.
        </p>
        <p>
          Kelime yalnızca doğru tahmini yapınca görünür. Eski günler{" "}
          <a href="/cevaplar">geçmiş cevaplar</a> sayfasında. Kurallar{" "}
          <a href="/nasil-oynanir">nasıl oynanır</a> sayfasında.
        </p>
      </article>
    </main>
  )
}
