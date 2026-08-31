"use client"

import * as React from "react"

import { trackConsultingView } from "@/lib/analytics"

export function TrackConsultingView() {
  React.useEffect(() => {
    trackConsultingView()
  }, [])

  return null
}
