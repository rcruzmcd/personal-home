import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { CovenSectionNav } from "@/components/coven/coven-section-nav"
import { DemoButton } from "@/components/coven/demo-button"
import { ScreenshotSlot } from "@/components/coven/screenshot-slot"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { PageShell } from "@/components/site/page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stat } from "@/components/ui/stat"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.coven.overview.metaTitle,
    description: t.coven.overview.metaDescription,
    alternates: buildAlternates("/coven", locale),
  }
}

export default async function CovenPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.coven
  const o = c.overview

  return (
    <PageShell id="main-content" brand="coven">
      {/* Like the site homepage, this hero *is* the page's headline content, so
          it takes no header stats and its CTAs stack below the copy rather than
          being pulled into the title row (docs/UX_PATTERNS.md §2). */}
      <PageHeader
        title={o.title}
        description={
          <>
            <p className="text-h4 font-semibold">{o.tagline}</p>
            <p className="mt-4">{o.intro}</p>
            <p className="mt-4 text-small text-muted">{o.audienceNote}</p>
          </>
        }
      />

      <CovenSectionNav current="overview" />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <DemoButton label={c.demo.cta} newTabHint={c.demo.newTabHint} from="overview" />
        <Button asChild variant="secondary">
          <LocaleLink href="/coven/modules">{o.seeModules}</LocaleLink>
        </Button>
      </div>
      <p className="mt-3 text-small text-muted">{c.demo.note}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Stat size="sm" tone="accent" label={o.proof.modules.label} value={o.proof.modules.value} />
        <Stat size="sm" label={o.proof.signup.label} value={o.proof.signup.value} />
        <Stat size="sm" label={o.proof.reset.label} value={o.proof.reset.value} />
      </div>

      <Section title={o.replaces.heading}>
        <dl className="divide-y divide-border border-y border-border">
          {/* Column headings on wide screens; each row repeats them inline when
              the grid collapses to one column. */}
          <div
            aria-hidden="true"
            className="hidden gap-8 py-3 text-label font-medium uppercase text-muted sm:grid sm:grid-cols-2"
          >
            <span>{o.replaces.todayLabel}</span>
            <span>{o.replaces.covenLabel}</span>
          </div>
          {o.replaces.rows.map((row) => (
            <div key={row.today} className="grid gap-1 py-4 sm:grid-cols-2 sm:gap-8">
              <dt className="text-muted">
                <span className="mb-1 block text-label font-medium uppercase text-muted sm:hidden">
                  {o.replaces.todayLabel}
                </span>
                {row.today}
              </dt>
              <dd className="text-foreground">
                <span className="mb-1 block text-label font-medium uppercase text-muted sm:hidden">
                  {o.replaces.covenLabel}
                </span>
                {row.withCoven}
              </dd>
            </div>
          ))}
        </dl>
        <p className="text-small text-muted">{o.replaces.footnote}</p>
      </Section>

      <Section title={o.strip.heading}>
        <div className="grid gap-6 sm:grid-cols-3">
          {o.strip.shots.map((caption) => (
            <ScreenshotSlot
              key={caption}
              caption={caption}
              pendingLabel={c.screenshotPending}
            />
          ))}
        </div>
      </Section>

      <Section title={o.doors.heading}>
        <p>{o.doors.body}</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card variant="featured">
            <CardHeader>
              <CardTitle asChild>
                <h3>{o.doors.nonprofits.title}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{o.doors.nonprofits.body}</p>
              <Button asChild variant="tertiary">
                <LocaleLink href="/coven/nonprofits">{o.doors.nonprofits.cta}</LocaleLink>
              </Button>
            </CardContent>
          </Card>
          <Card variant="featured">
            <CardHeader>
              <CardTitle asChild>
                <h3>{o.doors.business.title}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{o.doors.business.body}</p>
              <Button asChild variant="tertiary">
                <LocaleLink href="/coven/business">{o.doors.business.cta}</LocaleLink>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title={o.who.heading}>
        <p>{o.who.body}</p>
        <p>
          {o.who.emailIntro}{" "}
          <a
            href={`mailto:${o.who.email}`}
            className="text-purple underline transition-colors duration-200 hover:italic"
          >
            {o.who.email}
          </a>
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="secondary">
            <LocaleLink href="/about">{o.who.aboutCta}</LocaleLink>
          </Button>
          <Button asChild variant="secondary">
            <LocaleLink href="/contact">{o.who.contactCta}</LocaleLink>
          </Button>
        </div>
      </Section>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-2 text-h4 font-semibold text-foreground">{o.closing.heading}</p>
        <p className="mb-4 max-w-2xl">{o.closing.body}</p>
        <DemoButton
          label={c.demo.cta}
          newTabHint={c.demo.newTabHint}
          from="overview-footer"
        />
      </div>
    </PageShell>
  )
}
