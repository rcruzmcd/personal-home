import type { Metadata } from "next"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/content/page-header"
import { ProjectCard } from "@/components/project/project-card"
import { getWorkProjects } from "@/lib/content/projects"

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies from professional and volunteer engineering work.",
}

export default function WorkPage() {
  const projects = getWorkProjects()

  return (
    <main id="main-content" className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title="Work"
        description="Case studies from professional and volunteer engineering work — how the problem was understood, what was built, and what trade-offs shaped the result."
      />

      {projects.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} titleAs="h2" />
          ))}
        </div>
      ) : (
        // An empty state names the way out of it, rather than stopping at the
        // bare sentence (docs/UX_PATTERNS.md).
        <div className="mt-12">
          <p className="text-body text-muted">
            No case studies published yet — personal projects are written up in the
            meantime.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/projects">Browse projects</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
