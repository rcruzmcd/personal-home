import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { CovenSectionNav } from "@/components/coven/coven-section-nav"
import { DemoButton } from "@/components/coven/demo-button"
import { ModuleCards } from "@/components/coven/module-cards"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { PageShell } from "@/components/site/page-shell"
import { Button } from "@/components/ui/button"
import { BUSINESS_MODULES } from "@/lib/coven"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.coven.business.metaTitle,
    description: t.coven.business.metaDescription,
    alternates: buildAlternates("/coven/business", locale),
  }
}

export default async function CovenForBusinessPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.coven
  const b = c.business

  // Governance is absent by type, not by filtering: BUSINESS_MODULES excludes
  // it, and the business catalog carries no copy for it, so "advisory board
  // minutes" can't quietly appear here later.
  const modules = BUSINESS_MODULES.map((id) => ({ id, ...b.modules[id] }))

  return (
    <PageShell id="main-content" brand="coven">
      <PageHeader
        title={b.title}
        breadcrumb={[{ label: c.breadcrumbCoven, href: "/coven" }]}
        description={<p className="font-serif text-h4">{b.intro}</p>}
      />

      <CovenSectionNav current="business" />

      <div className="mt-8">
        <DemoButton label={c.demo.cta} newTabHint={c.demo.newTabHint} from="business" />
        <p className="mt-3 text-small text-muted">{c.demo.note}</p>
      </div>

      <Section title={b.leadHeading}>
        <p>{b.leadBody}</p>
      </Section>

      <Section title={b.modulesHeading}>
        <ModuleCards modules={modules} pendingLabel={c.screenshotPending} />
      </Section>

      {/* The known failure mode for this path is a business visitor bouncing
          off the nonprofit-seeded demo. Saying so is cheaper than losing them
          to it silently. */}
      <Section title={b.why.heading}>
        {b.why.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <Button asChild variant="secondary">
          <LocaleLink href="/contact">{b.why.cta}</LocaleLink>
        </Button>
      </Section>

      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row">
        <DemoButton
          label={c.demo.cta}
          newTabHint={c.demo.newTabHint}
          from="business-footer"
        />
        <Button asChild variant="secondary">
          <LocaleLink href="/coven/pricing">{c.nav.pricing}</LocaleLink>
        </Button>
      </div>
    </PageShell>
  )
}
