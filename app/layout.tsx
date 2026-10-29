import type { Metadata, Viewport } from "next"
import { Newsreader, Source_Sans_3 } from "next/font/google"

import { siteUrl } from "@/lib/site"

import "./globals.css"

const display = Newsreader({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
  style: ["normal", "italic"],
})

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Kelime5678 — Günlük Türkçe Kelime Oyunu",
    template: "%s | Kelime5678",
  },
  description:
    "5, 6, 7 ve 8 harfli günlük Türkçe kelime oyunu. Altı denemede günün kelimesini bulun. Kelime her gece yenilenir.",
  applicationName: "Kelime5678",
  authors: [{ name: "Kelime5678" }],
  creator: "Kelime5678",
  category: "game",
  alternates: { canonical: "/", languages: { tr: "/" } },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Kelime5678",
    title: "Kelime5678 — Günlük Türkçe Kelime Oyunu",
    description:
      "5, 6, 7 ve 8 harfli günlük Türkçe kelime oyunu. Altı denemede günün kelimesini bulun.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
  appleWebApp: { capable: true, title: "Kelime5678", statusBarStyle: "default" },
}

export const viewport: Viewport = {
  themeColor: "#9c2f2f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kelime5678",
  url: siteUrl(),
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  inLanguage: "tr",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", "price": "0", "priceCurrency": "TRY" },
  description:
    "Beş, altı, yedi ve sekiz harfli günlük Türkçe kelime tahmin oyunu. Her uzunluğun kelimesi Türkiye saatiyle gece yarısı değişir.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a className="skip" href="#icerik">
          İçeriğe geç
        </a>
        <div id="icerik">{children}</div>
        <footer className="site-foot">
          <div className="inner">
            <span className="foot-note">{"<3 M için geliştirildi"}</span>
            <a href="/cevaplar">Geçmiş cevaplar</a>
            <a href="/nasil-oynanir">Nasıl oynanır</a>
            <a href="/">Oyun paneli</a>
          </div>
        </footer>
      </body>
    </html>
  )
}
