import type { ReactNode } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"

// Flags content that hasn't been written yet — never blend a stand-in for
// real biographical/professional copy into normal body text.
export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <Alert variant="callout">
      <AlertDescription className="italic text-muted">{children}</AlertDescription>
    </Alert>
  )
}
