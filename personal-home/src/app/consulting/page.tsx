import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/content/page-header"
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
    description: ["Comprehensive review of your technology ecosystem."],
    details: [
      { label: "Deliverable", value: "Assessment + prioritized roadmap" },
      {
        label: "Covers",
        value:
          "Website, hosting, DNS, email, SaaS, security, access, analytics, payments, storage, backups, and costs.",
      },
    ],
    price: "Starting at $150–350 (nonprofit) or $350–500 (small business)",
  },
  {
    title: "Website & Web Applications",
    description: [
      "Modern websites and custom applications for organizations that have outgrown templates.",
    ],
    details: [
      { label: "Deliverable", value: "Scoped estimate and timeline" },
      {
        label: "For",
        value:
          "Growing nonprofits, small businesses, or organizations needing something specific to your workflow.",
      },
    ],
    price: "Starting at $1,500",
  },
  {
    title: "Technical Strategy",
    description: [
      'The question you actually need answered: "What should we use and why?"',
      "We map your constraints (budget, team, timeline, growth), review your options, and build a strategy that makes sense for you right now—not what looks good in a case study.",
    ],
    details: [
      {
        label: "Covers",
        value:
          "Technology selection, architecture, cloud infrastructure, integrations, data, authentication, automation.",
      },
    ],
    price: "Starting at $100/hour",
  },
  {
    title: "Internal Tools",
    description: [
      "Replace spreadsheets, manual workflows, and repetitive tasks with lightweight tools that actually work for your team.",
    ],
    details: [
      {
        label: "Examples",
        value:
          "Member management systems, inventory trackers, team dashboards, intake forms, approval workflows, reporting tools.",
      },
    ],
    price: "Starting at $1,500 (small tools), $5,000+ (larger systems)",
  },
] as const

export default function ConsultingPage() {
  return (
    <main id="main-content" className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <TrackConsultingView />
      {/* No header action here: the page's one primary action is "Start a
          conversation" at the foot of the body (docs/UX_PATTERNS.md §2a). */}
      <PageHeader
        title="Consulting"
        description={
          <p className="font-serif text-h4">
            Technology shouldn&apos;t be a source of confusion. I help small organizations
            and nonprofits figure out what you actually need—without unnecessary complexity
            or corporate overhead. I&apos;ve done this work (Board Member + Director of
            Digital Ops at Chatter Snow), and I understand your constraints.
          </p>
        }
      />

      <Section title="How this works">
        <p>
          Start with a conversation. 30 minutes, no pressure. You tell me what&apos;s broken
          or confusing about your technology. I listen.
        </p>
        <p>If it makes sense to go deeper, we figure out what that looks like together.</p>
      </Section>

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
          ))}
        </div>
      </Section>

      <Section title="Nonprofit & Community Support">
        <p>
          I believe small organizations should have access to good technology even when
          resources are limited.
        </p>
        <p>
          I offer reduced-rate consulting to nonprofits and community organizations, with
          limited pro bono capacity (1–2 projects per quarter).
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-h4 font-semibold text-foreground">Free</h3>
            <p className="mt-2">30-minute conversation to understand your situation</p>
          </div>
          <div>
            <h3 className="text-h4 font-semibold text-foreground">Paid</h3>
            <p className="mt-2">
              Anything involving detailed research, written audit, implementation, or ongoing
              support
            </p>
          </div>
        </div>
      </Section>

      <div className="mt-8 border-t border-border pt-8">
        <p className="mb-4 text-h4 font-semibold text-foreground">Ready to talk?</p>
        <Button asChild variant="primary">
          <Link href="/contact">Start a conversation</Link>
        </Button>
      </div>
    </main>
  )
}
