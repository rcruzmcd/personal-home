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
import { NONPROFIT_MODULES } from "@/lib/coven"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.coven.nonprofits.metaTitle,
    description: t.coven.nonprofits.metaDescription,
    alternates: buildAlternates("/coven/nonprofits", locale),
  }
}

export default async function CovenForNonprofitsPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.coven
  const n = c.nonprofits

  // Governance leads here: it is the module no donor CRM has, and the reason a
  // board is willing to move (see @/lib/coven for the ordering).
  const modules = NONPROFIT_MODULES.map((id) => ({ id, ...n.modules[id] }))

  return (
    <PageShell id="main-content" brand="coven">
      <PageHeader
        title={n.title}
        breadcrumb={[{ label: c.breadcrumbCoven, href: "/coven" }]}
        description={<p className="font-serif text-h4">{n.intro}</p>}
      />

      <CovenSectionNav current="nonprofits" />

      <div className="mt-8">
        <DemoButton label={c.demo.cta} newTabHint={c.demo.newTabHint} from="nonprofits" />
        <p className="mt-3 text-small text-muted">{c.demo.note}</p>
      </div>

      <Section title={n.leadHeading}>
        <p>{n.leadBody}</p>
      </Section>

      <Section title={n.modulesHeading}>
        <ModuleCards modules={modules} pendingLabel={c.screenshotPending} />
      </Section>

      <Section title={n.why.heading}>
        {n.why.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </Section>

      <div className="mt-8 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row">
        <DemoButton
          label={c.demo.cta}
          newTabHint={c.demo.newTabHint}
          from="nonprofits-footer"
        />
        <Button asChild variant="secondary">
          <LocaleLink href="/coven/pricing">{c.nav.pricing}</LocaleLink>
        </Button>
      </div>
    </PageShell>
  )
}
