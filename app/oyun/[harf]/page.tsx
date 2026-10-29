import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { Game } from "@/components/game"
import { cookieName, countsFor, readGame } from "@/lib/game"
import { pageMetadata } from "@/lib/seo"
import { siteUrl } from "@/lib/site"
import { LENGTHS, parseHarfParam } from "@/lib/types"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const dynamicParams = false

export function generateStaticParams() {
  return LENGTHS.map((harf) => ({ harf: String(harf) }))
}

type Props = { params: Promise<{ harf: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { harf: raw } = await params
  const harf = parseHarfParam(raw)
  if (!harf) return {}
  const { label } = countsFor(harf)
  return pageMetadata({
    title: `${harf} Harfli Günlük Kelime`,
    description: `${harf} harfli günlük Türkçe kelime. ${label} kelime içinden bugünün kelimesini altı denemede bulun.`,
    path: `/oyun/${harf}`,
  })
}

export default async function GamePage({ params }: Props) {
  const { harf: raw } = await params
  const harf = parseHarfParam(raw)
  if (!harf) notFound()

  const jar = await cookies()
  const state = readGame(harf, jar.get(cookieName(harf))?.value)

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Oyun paneli", item: `${siteUrl()}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: `${harf} harfli kelime`,
        item: `${siteUrl()}/oyun/${harf}`,
      },
    ],
  }

  return (
    <>
      <Game key={`${harf}-${state.date}`} initial={state} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  )
}
