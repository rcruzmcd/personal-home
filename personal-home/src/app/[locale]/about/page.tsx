import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    alternates: buildAlternates("/about", locale),
  }
}

export default async function AboutPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const about = t.about

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader title={about.title} description={about.description} />

      <div className="mt-4 divide-y divide-border">
        <Section title={about.whoIAm.heading}>
          <p>{about.whoIAm.body}</p>
        </Section>

        <Section title={about.whatIDo.heading}>
          <p>{about.whatIDo.body}</p>
        </Section>

        <Section title={about.howIWork.heading}>
          <p>{about.howIWork.systems}</p>
          <p>{about.howIWork.ownership}</p>
          <p>{about.howIWork.durability}</p>
        </Section>

        <Section title={about.experience.heading}>
          <p>{about.experience.body}</p>
          <p>
            {about.experience.resumeLinkPrefix}
            <LocaleLink href="/resume" className="text-purple underline hover:italic">
              {about.experience.resumeLinkLabel}
            </LocaleLink>
            {about.experience.resumeLinkSuffix}
          </p>
        </Section>

        <Section title={about.currently.heading}>
          <p>{about.currently.body}</p>
        </Section>

        <Section title={about.outsideOfWork.heading}>
          <p>
            {about.outsideOfWork.skiingPrefix}
            <LocaleLink
              href="/work/chatter-snow"
              className="text-purple underline hover:italic"
            >
              {about.outsideOfWork.skiingLinkLabel}
            </LocaleLink>
            {about.outsideOfWork.skiingSuffix}
          </p>
          <p>{about.outsideOfWork.sports}</p>
          <p>{about.outsideOfWork.reading}</p>
        </Section>
      </div>
    </main>
  )
}
