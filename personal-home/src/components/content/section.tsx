import type { ReactNode } from "react"

import { AccentBar } from "@/components/ui/accent-bar"

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-8">
      <AccentBar width="md" className="mb-4" />
      <h2 className="text-h2 font-semibold text-purple">{title}</h2>
      <div className="mt-4 space-y-4 text-body text-foreground">{children}</div>
    </section>
  )
}
