import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { CovenSectionNav } from "@/components/coven/coven-section-nav"
import { DemoButton } from "@/components/coven/demo-button"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { PlaceholderNote } from "@/components/content/placeholder-note"
import { Section } from "@/components/content/section"
import { PageShell } from "@/components/site/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { COVEN_PLANS } from "@/lib/coven"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.coven.pricing.metaTitle,
    description: t.coven.pricing.metaDescription,
    alternates: buildAlternates("/coven/pricing", locale),
  }
}

export default async function CovenPricingPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.coven
  const p = c.pricing

  return (
    <PageShell id="main-content" brand="coven">
      <PageHeader
        title={p.title}
        breadcrumb={[{ label: c.breadcrumbCoven, href: "/coven" }]}
        description={<p className="font-serif text-h4">{p.intro}</p>}
      />

      <CovenSectionNav current="pricing" />

      {/* The numbers below are a draft. They are flagged the same way any
          unwritten copy on this site is, rather than presented as settled
          (docs: the pricing page can't launch until these are confirmed). */}
      <div className="mt-8">
        <PlaceholderNote>{p.draftNote}</PlaceholderNote>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {COVEN_PLANS.map((id) => {
          const plan = p.plans[id]
          return (
            <Card key={id} variant={id === "growing" ? "featured" : "standard"}>
              <CardHeader>
                <CardTitle asChild>
                  <h2>{plan.name}</h2>
                </CardTitle>
                <CardDescription>{plan.fit}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  <span className="text-h2 font-bold text-purple">{plan.price}</span>
                  <span className="text-small text-muted">{p.perMonth}</span>
                </p>
                <p className="text-small text-muted">{plan.annual}</p>
                <ul className="space-y-2 text-small">
                  {plan.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Section title={p.everyPlanHeading}>
        <ul className="list-disc space-y-2 pl-5">
          {p.everyPlan.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={p.onboarding.heading}>
        <p className="text-h4 font-semibold text-foreground">{p.onboarding.price}</p>
        <p>{p.onboarding.body}</p>
        <p>{p.onboarding.nonprofit}</p>
      </Section>

      <div className="mt-8 space-y-2 border-t border-border pt-8 text-small text-muted">
        {p.notes.map((note) => (
          <p key={note}>{note}</p>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <DemoButton label={c.demo.cta} newTabHint={c.demo.newTabHint} from="pricing" />
        <Button asChild variant="secondary">
          <LocaleLink href="/coven/faq">{p.faqCta}</LocaleLink>
        </Button>
      </div>
    </PageShell>
  )
}
