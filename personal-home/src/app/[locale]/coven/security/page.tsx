import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { CovenSectionNav } from "@/components/coven/coven-section-nav"
import { DemoButton } from "@/components/coven/demo-button"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { PageShell } from "@/components/site/page-shell"
import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.coven.security.metaTitle,
    description: t.coven.security.metaDescription,
    alternates: buildAlternates("/coven/security", locale),
  }
}

export default async function CovenSecurityPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.coven
  const s = c.security

  return (
    <PageShell id="main-content" brand="coven">
      <PageHeader
        title={s.title}
        breadcrumb={[{ label: c.breadcrumbCoven, href: "/coven" }]}
        description={<p className="font-serif text-h4">{s.intro}</p>}
      />

      <CovenSectionNav current="security" />

      <div className="mt-8 max-w-3xl space-y-8">
        {s.items.map((item) => (
          <section key={item.title}>
            <h2 className="text-h4 font-semibold text-foreground">{item.title}</h2>
            <p className="mt-2 text-body text-foreground">{item.body}</p>
          </section>
        ))}
      </div>

      <Section title={s.hosting.heading}>
        <p className="max-w-3xl">{s.hosting.body}</p>
      </Section>

      <Section title={s.ask.heading}>
        <p className="max-w-3xl">{s.ask.body}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="primary">
            <LocaleLink href="/contact">{s.ask.cta}</LocaleLink>
          </Button>
          <DemoButton
            label={c.demo.cta}
            newTabHint={c.demo.newTabHint}
            from="security"
            variant="secondary"
          />
        </div>
      </Section>
    </PageShell>
  )
}
