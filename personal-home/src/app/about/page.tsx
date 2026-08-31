import type { Metadata } from "next"

import { AccentBar } from "@/components/ui/accent-bar"
import { Section } from "@/components/content/section"
import { PlaceholderNote } from "@/components/content/placeholder-note"

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, what I do, and how I work.",
}

const SECTIONS = [
  {
    heading: "Who I am",
    placeholder: "a short personal introduction.",
  },
  {
    heading: "What I do",
    placeholder: "a description of software engineering, product, and systems focus.",
  },
  {
    heading: "How I work",
    placeholder: "an approach to solving problems.",
  },
  {
    heading: "Experience",
    placeholder: "professional history.",
  },
  {
    heading: "Currently",
    placeholder: "what's being worked on right now.",
  },
  {
    heading: "Outside of work",
    placeholder: "personal interests — skiing, fitness, projects, community involvement.",
  },
] as const

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <AccentBar width="md" className="mb-6" />
      <h1 className="text-h1 font-bold text-purple">About</h1>
      <p className="mt-4 max-w-2xl text-body text-foreground">
        The person behind the work, not just the resume.
      </p>

      <div className="mt-4 divide-y divide-border">
        {SECTIONS.map((section) => (
          <Section key={section.heading} title={section.heading}>
            <PlaceholderNote>
              [Placeholder — Rickie to write {section.placeholder}]
            </PlaceholderNote>
          </Section>
        ))}
      </div>
    </main>
  )
}
