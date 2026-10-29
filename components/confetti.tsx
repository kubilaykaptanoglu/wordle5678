"use client"

import { useEffect, useRef } from "react"

const COLORS = ["#0f6a45", "#e8b931", "#9c2f2f", "#1c1712", "#f4efe4"]

type Bit = {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  rot: number
  spin: number
  color: string
  life: number
}

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const context = canvas.getContext("2d")
    if (!context) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const bits: Bit[] = Array.from({ length: 150 }, () => ({
      x: canvas.width * (0.15 + Math.random() * 0.7),
      y: canvas.height * 0.28 + Math.random() * 40,
      vx: (Math.random() - 0.5) * 11,
      vy: -8 - Math.random() * 8,
      w: 6 + Math.random() * 7,
      h: 8 + Math.random() * 8,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0],
      life: 90 + Math.floor(Math.random() * 40),
    }))

    let frame = 0
    let raf = 0
    const tick = () => {
      frame += 1
      context.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const bit of bits) {
        bit.vy += 0.18
        bit.x += bit.vx
        bit.y += bit.vy
        bit.rot += bit.spin
        bit.life -= 1
        if (bit.life <= 0) continue
        alive = true
        context.save()
        context.translate(bit.x, bit.y)
        context.rotate(bit.rot)
        context.globalAlpha = Math.min(1, bit.life / 25)
        context.fillStyle = bit.color
        context.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h)
        context.restore()
      }
      if (alive && frame < 240) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />
}
