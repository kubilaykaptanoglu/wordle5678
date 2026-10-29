import type { Metadata } from "next"

import { siteUrl } from "./site"

export function pageMetadata(options: {
  title?: string
  absoluteTitle?: string
  description: string
  path: string
}): Metadata {
  const title = options.absoluteTitle ?? options.title ?? "Kelime5678"
  const url = options.path === "/" ? siteUrl() : `${siteUrl()}${options.path}`
  return {
    title: options.absoluteTitle ? { absolute: options.absoluteTitle } : options.title,
    description: options.description,
    alternates: { canonical: options.path },
    openGraph: {
      title,
      description: options.description,
      url,
      locale: "tr_TR",
      type: "website",
      siteName: "Kelime5678",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: options.description,
    },
  }
}
