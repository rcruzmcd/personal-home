import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/content/page-header"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="That page doesn't exist, or it moved. The links below cover everything on the site."
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button asChild variant="primary">
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/work">View my work</Link>
        </Button>
      </div>
    </main>
  )
}
