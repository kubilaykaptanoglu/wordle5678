import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const now = new Date()
  const paths = ["", "/nasil-oynanir", "/cevaplar", "/oyun/5", "/oyun/6", "/oyun/7", "/oyun/8"]
  return paths.map((path) => ({
    url: path === "" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path.startsWith("/oyun") || path === "/cevaplar" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }))
}
