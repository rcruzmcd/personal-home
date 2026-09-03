"use client"

import { Button } from "@/components/ui/button"
import { trackResumeDownload } from "@/lib/analytics"

export function DownloadResumeButton() {
  return (
    <Button asChild variant="secondary">
      <a href="/resume.pdf" download onClick={() => trackResumeDownload({ method: "pdf" })}>
        Download PDF
      </a>
    </Button>
  )
}
