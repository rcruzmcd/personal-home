"use client"

import { Button } from "@/components/ui/button"
import { useMessages } from "@/components/i18n/i18n-provider"
import { trackResumeDownload } from "@/lib/analytics"

// The resume page's own print stylesheet (see globals.css) is what produces
// the PDF — the browser's print dialog offers "Save as PDF" — so there is no
// second document to keep in sync with this page.
export function PrintResumeButton() {
  const messages = useMessages()

  return (
    <Button
      variant="secondary"
      onClick={() => {
        trackResumeDownload({ method: "print" })
        window.print()
      }}
    >
      {messages.printResume}
    </Button>
  )
}
