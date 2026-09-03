"use client"

import { useEffect } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/content/page-header"

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
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title="Something went wrong"
        description="This page failed to load. Trying again usually works — if it doesn't, let me know what you were looking for."
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button variant="primary" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">Report the problem</Link>
        </Button>
      </div>

      {error.digest ? (
        <p className="mt-8 text-small text-muted">Reference: {error.digest}</p>
      ) : null}
    </main>
  )
}
