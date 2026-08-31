import type { Metadata } from "next"
import Link from "next/link"

import { AccentBar } from "@/components/ui/accent-bar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Section } from "@/components/content/section"
import { TrackConsultingView } from "@/components/analytics/track-consulting-view"

export const metadata: Metadata = {
  title: "Consulting",
  description:
    "Technology assessments, websites and web applications, technical strategy, and internal tools for small organizations.",
}

const SERVICES = [
  {
    title: "Technology Health Check",
    description: "A review of your organization's technology ecosystem.",
    deliverable: "A technology assessment and prioritized roadmap.",
    covers:
      "Website, hosting, DNS, email, SaaS, security, access, analytics, payments, storage, backups, and costs.",
    price: "Starting at $150–350 (nonprofit) or $350–500 (small business)",
  },
  {
    title: "Website & Web Applications",
    description: "Modern websites and custom web applications.",
    deliverable: "For organizations that have outgrown templates.",
    covers: null,
    price: "Starting at $1,500",
  },
  {
    title: "Technical Strategy",
    description: 'Help answering: "What should we actually use?"',
    deliverable: null,
    covers:
      "Technology selection, architecture, cloud infrastructure, integrations, data, authentication, and automation.",
    price: "Starting at $100/hour",
  },
  {
    title: "Internal Tools",
    description:
      "Lightweight tools that replace spreadsheets, manual workflows, and repetitive processes.",
    deliverable: null,
    covers: null,
    price: "Custom pricing",
  },
] as const

export default function ConsultingPage() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <TrackConsultingView />
      <AccentBar width="md" className="mb-6" />
      <h1 className="text-h1 font-bold text-purple">Consulting</h1>

      <p className="mt-6 max-w-2xl font-serif text-h4 text-foreground">
        Technology shouldn&apos;t be a source of confusion. I help small organizations
        understand their technology, improve their digital infrastructure, and build the
        tools they actually need.
      </p>

      <Section title="Services">
        <div className="grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <Card key={service.title} variant="standard">
              <CardHeader>
                <CardTitle asChild>
                  <h3>{service.title}</h3>
                </CardTitle>
                <CardDescription>{service.price}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{service.description}</p>
                {service.deliverable ? (
                  <p className="text-small text-muted">
                    <span className="font-medium text-foreground">Deliverable: </span>
                    {service.deliverable}
                  </p>
                ) : null}
                {service.covers ? (
                  <p className="text-small text-muted">
                    <span className="font-medium text-foreground">Covers: </span>
                    {service.covers}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Nonprofit & Community Support">
        <p>
          Reduced-rate consulting is available for qualifying nonprofits and community
          organizations, with limited pro bono capacity of one to two projects per quarter.
          It starts with a free 30-minute conversation.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-h4 font-semibold text-foreground">Free</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>A 30-minute consultation</li>
              <li>
                Or a 60-minute technology health check (up to 3–5 recommendations)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-foreground">Paid</h3>
            <p className="mt-2">
              Anything involving detailed research, a written audit, architecture,
              implementation, development, migration, vendor comparison, or ongoing support.
            </p>
          </div>
        </div>
      </Section>

      <div className="mt-8 border-t border-border pt-8">
        <Button asChild variant="primary">
          <Link href="/contact">Start a conversation</Link>
        </Button>
      </div>
    </main>
  )
}
