import type { Metadata } from "next"

import { AccentBar } from "@/components/ui/accent-bar"
import { Section } from "@/components/content/section"
import { PlaceholderNote } from "@/components/content/placeholder-note"

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for rickiecruz.com.",
}

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <AccentBar width="md" className="mb-6" />
      <h1 className="text-h1 font-bold text-purple">Terms</h1>
      <p className="mt-4 text-small text-muted">
        Last updated: [Placeholder — set this when the terms are finalized]
      </p>

      <div className="mt-4 divide-y divide-border">
        <Section title="Use of This Site">
          <p>
            This site and its content — including case studies, project write-ups, and any
            code samples referenced — are provided for informational purposes. You&apos;re
            welcome to read, share, and link to it.
          </p>
        </Section>

        <Section title="Content Ownership">
          <p>
            Unless otherwise noted, the content, design, and branding on this site are &copy;{" "}
            {new Date().getFullYear()} Rickie Cruz. Project names and logos referenced in case
            studies (for example, Chatter Snow) belong to their respective organizations.
          </p>
        </Section>

        <Section title="Consulting Engagements">
          <PlaceholderNote>
            [Placeholder — Rickie to confirm whether a separate services agreement governs
            paid consulting engagements, or whether these terms should cover that scope
            directly.]
          </PlaceholderNote>
        </Section>

        <Section title="No Warranty">
          <p>
            This site and its content are provided &quot;as is,&quot; without warranty of any
            kind. Case study outcomes and metrics reflect the author&apos;s own account of the
            work and are not independently audited.
          </p>
        </Section>

        <Section title="Governing Law">
          <PlaceholderNote>
            [Placeholder — Rickie to specify the governing jurisdiction, if these terms need
            one.]
          </PlaceholderNote>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:hello@rickiecruz.com"
              className="text-purple underline hover:italic"
            >
              hello@rickiecruz.com
            </a>
            .
          </p>
        </Section>
      </div>
    </main>
  )
}
