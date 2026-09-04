import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { formatDate } from "@/lib/date"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

// The one value here that isn't derived from how the site actually works.
const GOVERNING_STATE = "New York"

const LAST_UPDATED = "2026-09-03"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.terms.metaTitle,
    description: t.terms.metaDescription,
    alternates: buildAlternates("/terms", locale),
  }
}

export default async function TermsPage() {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)
  const terms = t.terms

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title={terms.title}
        description={
          <p className="text-small text-muted">
            {t.legal.lastUpdated(formatDate(LAST_UPDATED, locale))}
          </p>
        }
      />

      <div className="mt-4 divide-y divide-border">
        <Section title={terms.use.heading}>
          <p>{terms.use.body}</p>
        </Section>

        <Section title={terms.ownership.heading}>
          <p>{terms.ownership.body(new Date().getFullYear())}</p>
        </Section>

        <Section title={terms.engagements.heading}>
          <p>
            {terms.engagements.offerPrefix}
            <LocaleLink href="/consulting" className="text-purple underline hover:italic">
              {terms.engagements.consultingLinkLabel}
            </LocaleLink>
            {terms.engagements.offerSuffix}
          </p>
          <p>{terms.engagements.agreement}</p>
        </Section>

        <Section title={terms.warranty.heading}>
          <p>{terms.warranty.body}</p>
        </Section>

        <Section title={terms.governingLaw.heading}>
          <p>{terms.governingLaw.body(GOVERNING_STATE)}</p>
          <p>{terms.governingLaw.separateAgreement}</p>
        </Section>

        <Section title={terms.contact.heading}>
          <p>
            {terms.contact.prefix}
            <LocaleLink href="/contact" className="text-purple underline hover:italic">
              {terms.contact.linkLabel}
            </LocaleLink>
            {terms.contact.suffix}
          </p>
        </Section>
      </div>
    </main>
  )
}
