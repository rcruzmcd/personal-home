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
import { COVEN_MODULES } from "@/lib/coven"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.coven.modules.metaTitle,
    description: t.coven.modules.metaDescription,
    alternates: buildAlternates("/coven/modules", locale),
  }
}

export default async function CovenModulesPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.coven
  const m = c.modules

  // The audience-neutral vocabulary. Both audience pages rename these; nothing
  // here is exclusive to one of them.
  const modules = COVEN_MODULES.map((id) => ({ id, ...m.items[id] }))

  return (
    <PageShell id="main-content" brand="coven">
      <PageHeader
        title={m.title}
        breadcrumb={[{ label: c.breadcrumbCoven, href: "/coven" }]}
        description={<p className="font-serif text-h4">{m.intro}</p>}
      />

      <CovenSectionNav current="modules" />

      <Section title={m.itemsHeading}>
        <ModuleCards modules={modules} pendingLabel={c.screenshotPending} />
      </Section>

      <Section title={m.lexicon.heading}>
        <p>{m.lexicon.body}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="secondary">
            <LocaleLink href="/coven/nonprofits">{c.nav.nonprofits}</LocaleLink>
          </Button>
          <Button asChild variant="secondary">
            <LocaleLink href="/coven/business">{c.nav.business}</LocaleLink>
          </Button>
        </div>
      </Section>

      <div className="mt-8 border-t border-border pt-8">
        <DemoButton label={c.demo.cta} newTabHint={c.demo.newTabHint} from="modules" />
        <p className="mt-3 text-small text-muted">{c.demo.note}</p>
      </div>
    </PageShell>
  )
}
