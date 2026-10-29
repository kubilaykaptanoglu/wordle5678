"use client"

import { usePathname } from "next/navigation"

export function HomeLinkAnchor() {
  return (
    <a className="home-link" href="/">
      <span aria-hidden="true">←</span>
      Ana ekrana dön
    </a>
  )
}

export function HomeLink() {
  const path = usePathname()
  if (!path || path === "/" || path.startsWith("/oyun")) return null
  return (
    <div className="home-row">
      <HomeLinkAnchor />
    </div>
  )
}
