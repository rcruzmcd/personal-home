import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { TrackConsultingView } from "@/components/analytics/track-consulting-view"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

// Fixes the render order of the service cards. The copy itself lives in the
// string catalog, keyed by these ids.
const SERVICE_ORDER = ["healthCheck", "websites", "strategy", "internalTools"] as const

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.consulting.metaTitle,
    description: t.consulting.metaDescription,
    alternates: buildAlternates("/consulting", locale),
  }
}

export default async function ConsultingPage() {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const c = t.consulting

  return (
    <main id="main-content" className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <TrackConsultingView />
      {/* No header action here: the page's one primary action is "Start a
          conversation" at the foot of the body (docs/UX_PATTERNS.md §2a). */}
      <PageHeader
        title={c.title}
        description={<p className="font-serif text-h4">{c.intro}</p>}
      />

      <Section title={c.howThisWorks.heading}>
        <p>{c.howThisWorks.conversation}</p>
        <p>{c.howThisWorks.deeper}</p>
      </Section>

      <Section title={c.servicesHeading}>
        <div className="grid gap-6 sm:grid-cols-2">
          {SERVICE_ORDER.map((key) => {
            const service = c.services[key]
            return (
              <Card key={key} variant="standard">
                <CardHeader>
                  <CardTitle asChild>
                    <h3>{service.title}</h3>
                  </CardTitle>
                  <CardDescription>{service.price}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {service.description.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {service.details.map((detail) => (
                    <p key={detail.label} className="text-small text-muted">
                      <span className="font-medium text-foreground">{detail.label}: </span>
                      {detail.value}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Section>

      <Section title={c.nonprofit.heading}>
        <p>{c.nonprofit.belief}</p>
        <p>{c.nonprofit.offer}</p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-h4 font-semibold text-foreground">
              {c.nonprofit.freeHeading}
            </h3>
            <p className="mt-2">{c.nonprofit.freeBody}</p>
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-foreground">
              {c.nonprofit.paidHeading}
            </h3>
            <p className="mt-2">{c.nonprofit.paidBody}</p>
          </div>
        </div>
      </Section>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-4 text-h4 font-semibold text-foreground">{c.readyToTalk}</p>
        <Button asChild variant="primary">
          <LocaleLink href="/contact">{c.startConversation}</LocaleLink>
        </Button>
      </div>
    </main>
  )
}
