"use client"

import { useEffect, useState } from "react"

import { istanbulDate, istanbulLabel } from "@/lib/istanbul"

export function Today() {
  const [label, setLabel] = useState("bugün")

  useEffect(() => {
    setLabel(istanbulLabel(istanbulDate()))
  }, [])

  return <span>{label}</span>
}
