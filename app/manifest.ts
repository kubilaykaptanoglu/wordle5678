import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kelime5678",
    short_name: "Kelime5678",
    description: "5, 6, 7 ve 8 harfli günlük Türkçe kelime oyunu.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#efe6d6",
    theme_color: "#9c2f2f",
    lang: "tr",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "5 harf", url: "/oyun/5" },
      { name: "6 harf", url: "/oyun/6" },
      { name: "7 harf", url: "/oyun/7" },
      { name: "8 harf", url: "/oyun/8" },
    ],
  }
}
