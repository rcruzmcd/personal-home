"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/content/page-header"
import { LocaleLink } from "@/components/i18n/locale-link"
import { useMessages } from "@/components/i18n/i18n-provider"

// Route-level error boundary. Next.js strips the message from production
// errors and replaces it with a digest, so the visitor gets a stable apology
// and a way out rather than error text that would be empty in prod anyway.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const messages = useMessages()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title={messages.error.title}
        description={messages.error.description}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button variant="primary" onClick={reset}>
          {messages.error.tryAgain}
        </Button>
        <Button asChild variant="secondary">
          <LocaleLink href="/">{messages.error.backHome}</LocaleLink>
        </Button>
        <Button asChild variant="secondary">
          <LocaleLink href="/contact">{messages.error.report}</LocaleLink>
        </Button>
      </div>

      {error.digest ? (
        <p className="mt-8 text-small text-muted">{messages.error.reference} {error.digest}</p>
      ) : null}
    </main>
  )
}
