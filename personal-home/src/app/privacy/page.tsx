import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How rickiecruz.com collects, uses, and protects information.",
}

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title="Privacy Policy"
        description={
          <p className="text-small text-muted">
            Last updated: September 3, 2026
          </p>
        }
      />

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
          <p>
            This site has no database and no user accounts. A contact form submission arrives
            as an email in my inbox, and that email is the only copy I keep. I hold onto it for
            as long as it takes to respond and to keep a reasonable record of the conversation
            afterward — inquiries that don&apos;t lead to work are deleted within 24 months.
            The transactional email provider that relays the message keeps its own short-term
            delivery logs under its own retention policy.
          </p>
          <p>
            Your IP address is used only in memory, for a matter of seconds, to rate-limit the
            contact form against spam. It is never written to a database and is not included in
            the email I receive. Separately, my hosting provider keeps standard server request
            logs, which include IP addresses, for a limited period.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>
            You can ask me what information of yours I hold, ask me to correct it, or ask me to
            delete it. Send the request through the{" "}
            <Link href="/contact" className="text-purple underline hover:italic">
              contact form
            </Link>{" "}
            from the same email address you originally wrote in from, and I&apos;ll confirm
            within 30 days. Because the only information I hold is what you typed into that
            form, honoring a deletion request means deleting the email thread.
          </p>
          <p>
            I don&apos;t sell or share personal information, and this site runs no advertising,
            profiling, or cross-site tracking. Depending on where you live, you may have
            additional statutory rights — for example under the GDPR in the EEA and UK, or the
            CCPA in California. I handle requests the same way regardless of whether a
            particular law applies to you.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy can be sent via the{" "}
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
