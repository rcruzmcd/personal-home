import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"

// The one value here that isn't derived from how the site actually works.
const GOVERNING_STATE = "New York"

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for rickiecruz.com.",
}

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title="Terms"
        description={
          <p className="text-small text-muted">
            Last updated: September 3, 2026
          </p>
        }
      />

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
          <p>
            Nothing on this site is an offer, a quote, or a contract. The service descriptions
            and starting rates on the{" "}
            <Link href="/consulting" className="text-purple underline hover:italic">
              consulting page
            </Link>{" "}
            are a starting point for a conversation and are subject to change — actual pricing
            depends on scope.
          </p>
          <p>
            Paid work is governed by a separate written agreement covering scope, deliverables,
            timeline, fees, payment terms, ownership of the work, and confidentiality, signed
            before the work begins. These terms cover your use of this website only. Where a
            signed agreement and these terms conflict, the signed agreement controls.
          </p>
        </Section>

        <Section title="No Warranty">
          <p>
            This site and its content are provided &quot;as is,&quot; without warranty of any
            kind. Case study outcomes and metrics reflect the author&apos;s own account of the
            work and are not independently audited.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            These terms are governed by the laws of the State of {GOVERNING_STATE}, United
            States, without regard to its conflict-of-laws rules, and any dispute arising from
            your use of this site will be brought in the state or federal courts located there.
            If any provision of these terms is found unenforceable, the remaining provisions
            stay in effect.
          </p>
          <p>
            This applies to the website. A signed consulting agreement carries its own
            governing-law and dispute-resolution terms, and those control for that work.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms can be sent via the{" "}
            <Link href="/contact" className="text-purple underline hover:italic">
              contact form
            </Link>
            .
          </p>
        </Section>
      </div>
    </main>
  )
}
