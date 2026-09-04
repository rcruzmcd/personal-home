"use client"

import { Button } from "@/components/ui/button"
import { useMessages } from "@/components/i18n/i18n-provider"
import { trackResumeDownload } from "@/lib/analytics"

export function DownloadResumeButton() {
  const messages = useMessages()

  return (
    <Button asChild variant="secondary">
      <a href="/resume.pdf" download onClick={() => trackResumeDownload({ method: "pdf" })}>
        {messages.downloadResume}
      </a>
    </Button>
  )
}
