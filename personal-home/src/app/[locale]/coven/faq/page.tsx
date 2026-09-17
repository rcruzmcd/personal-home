import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { CovenSectionNav } from "@/components/coven/coven-section-nav"
import { DemoButton } from "@/components/coven/demo-button"
import { LocaleLink } from "@/components/i18n/locale-link"
import { JsonLd } from "@/components/seo/json-ld"
import { PageHeader } from "@/components/content/page-header"
import { PageShell } from "@/components/site/page-shell"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.coven.faq.metaTitle,
    description: t.coven.faq.metaDescription,
    alternates: buildAlternates("/coven/faq", locale),
  }
}

export default async function CovenFaqPage() {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)
  const c = t.coven
  const f = c.faq

  // The questions are already the page's content, so describing them as a
  // FAQPage costs one script tag and lets search engines answer them directly.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: f.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <PageShell id="main-content" brand="coven">
      <JsonLd data={faqJsonLd} />

      <PageHeader
        title={f.title}
        breadcrumb={[{ label: c.breadcrumbCoven, href: "/coven" }]}
        description={<p className="font-serif text-h4">{f.intro}</p>}
      />

      <CovenSectionNav current="faq" />

      <dl className="mt-8 max-w-3xl divide-y divide-border border-y border-border">
        {f.items.map((item) => (
          <div key={item.question} className="py-6">
            <dt className="text-h4 font-semibold text-foreground">{item.question}</dt>
            <dd className="mt-2 text-body text-foreground">{item.answer}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <DemoButton label={c.demo.cta} newTabHint={c.demo.newTabHint} from="faq" />
        <Button asChild variant="secondary">
          <LocaleLink href="/contact">{c.overview.who.contactCta}</LocaleLink>
        </Button>
      </div>
    </PageShell>
  )
}
