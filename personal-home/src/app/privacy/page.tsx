import type { Metadata } from "next"

import { AccentBar } from "@/components/ui/accent-bar"
import { Section } from "@/components/content/section"
import { PlaceholderNote } from "@/components/content/placeholder-note"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How rickiecruz.com collects, uses, and protects information.",
}

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <AccentBar width="md" className="mb-6" />
      <h1 className="text-h1 font-bold text-purple">Privacy Policy</h1>
      <p className="mt-4 text-small text-muted">
        Last updated: [Placeholder — set this when the policy is finalized]
      </p>

      <div className="mt-4 divide-y divide-border">
        <Section title="What This Site Collects">
          <p>
            The contact form collects the information you submit — name, email, organization
            (optional), the category you select, and your message — solely to respond to your
            inquiry. No account creation or login is required to use this site.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            This site uses Vercel Analytics, a privacy-conscious, cookie-free analytics
            service. It reports aggregate page views and a small set of named interaction
            events (for example, viewing a project or submitting the contact form) without
            tracking individuals across sites or storing personal identifiers.
          </p>
        </Section>

        <Section title="Cookies">
          <p>
            This site does not use tracking or advertising cookies. A small amount of data may
            be stored in your browser&apos;s local storage only to remember your light/dark
            mode preference — this stays on your device and is never sent to a server.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>
            Contact form submissions may be relayed through a transactional email provider
            solely to deliver the message. That provider does not use your information for any
            other purpose.
          </p>
        </Section>

        <Section title="Data Retention">
          <PlaceholderNote>
            [Placeholder — Rickie to specify how long contact form submissions and any related
            records are retained.]
          </PlaceholderNote>
        </Section>

        <Section title="Your Rights">
          <PlaceholderNote>
            [Placeholder — Rickie to confirm the process for requesting access to, correction
            of, or deletion of any information submitted through this site, and note the
            governing jurisdiction if one applies.]
          </PlaceholderNote>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy can be sent to{" "}
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
