import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { formatDate } from "@/lib/date"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

// Stored as an ISO date rather than prose so it renders in the reader's
// language; bump it whenever the policy text changes.
const LAST_UPDATED = "2026-09-03"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    alternates: buildAlternates("/privacy", locale),
  }
}

export default async function PrivacyPage() {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)
  const p = t.privacy

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title={p.title}
        description={
          <p className="text-small text-muted">
            {t.legal.lastUpdated(formatDate(LAST_UPDATED, locale))}
          </p>
        }
      />

      <div className="mt-4 divide-y divide-border">
        <Section title={p.collects.heading}>
          <p>{p.collects.body}</p>
        </Section>

        <Section title={p.analytics.heading}>
          <p>{p.analytics.body}</p>
        </Section>

        <Section title={p.cookies.heading}>
          <p>{p.cookies.body}</p>
        </Section>

        <Section title={p.thirdParty.heading}>
          <p>{p.thirdParty.body}</p>
        </Section>

        <Section title={p.retention.heading}>
          <p>{p.retention.inbox}</p>
          <p>{p.retention.ip}</p>
        </Section>

        <Section title={p.rights.heading}>
          <p>
            {p.rights.requestPrefix}
            <LocaleLink href="/contact" className="text-purple underline hover:italic">
              {p.rights.contactLinkLabel}
            </LocaleLink>
            {p.rights.requestSuffix}
          </p>
          <p>{p.rights.noSelling}</p>
        </Section>

        <Section title={p.contact.heading}>
          <p>
            {p.contact.prefix}
            <LocaleLink href="/contact" className="text-purple underline hover:italic">
              {p.contact.linkLabel}
            </LocaleLink>
            {p.contact.suffix}
          </p>
        </Section>
      </div>
    </main>
  )
}
