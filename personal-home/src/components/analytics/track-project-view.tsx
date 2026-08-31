"use client"

import * as React from "react"

import { trackProjectView } from "@/lib/analytics"

export function TrackProjectView({
  slug,
  category,
}: {
  slug: string
  category: "work" | "project"
}) {
  React.useEffect(() => {
    trackProjectView({ slug, category })
  }, [slug, category])

  return null
}
