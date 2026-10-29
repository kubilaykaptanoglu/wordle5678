import { Legend } from "@/components/legend"
import { faq } from "@/lib/copy"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Nasıl Oynanır",
  description:
    "Kelime5678 kuralları: 5, 6, 7 ve 8 harfli günlük Türkçe kelime, altı deneme, yeşil sarı gri kutular ve gece yarısı yenilenen kelime.",
  path: "/nasil-oynanir",
})

export default function HowToPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <main className="page prose">
      <p className="kicker">Kelime5678</p>
      <h1>Nasıl oynanır</h1>
      <p>
        Her gün dört kelime vardır: 5, 6, 7 ve 8 harfli. Panelden birini seç. Altı tahminde bul. Türkiye
        saatiyle gece yarısı dördü birden değişir. Kelime yalnızca doğru tahmini yapınca görünür.
      </p>
      <Legend />
      <h2>Kurallar</h2>
      <p>Tahmin, seçtiğin uzunlukta ve sözlükte olmalıdır. Sözlükte yoksa deneme hakkın gitmez.</p>
      <p>
        Aynı harf birden fazla geçebilir. İki yeşil harf varsa üçüncü aynı harf gri olabilir.
      </p>
      <p>
        <span translate="no">ı</span> ile <span translate="no">i</span>, <span translate="no">o</span> ile{" "}
        <span translate="no">ö</span>, <span translate="no">u</span> ile <span translate="no">ü</span> ayrı
        harftir.
      </p>
      <h2>Sık sorulanlar</h2>
      <dl className="faq">
        {faq.map((item) => (
          <div key={item.question}>
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
      <p>
        <a href="/">Oyun paneline dön</a>
        {" · "}
        <a href="/cevaplar">Geçmiş cevaplar</a>
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  )
}
