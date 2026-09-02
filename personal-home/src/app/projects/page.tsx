import type { Metadata } from "next"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/content/page-header"
import { ProjectCard } from "@/components/project/project-card"
import { getPersonalProjects } from "@/lib/content/projects"

export const metadata: Metadata = {
  title: "Projects",
  description: "Personal projects — what they do, why they were built, and how.",
}

export default function ProjectsPage() {
  const projects = getPersonalProjects()

  return (
    <main id="main-content" className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title="Projects"
        description="Personal projects, separate from professional work — built to learn something, solve a real problem, or explore an idea."
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
            No projects published yet — the professional case studies are the fuller read
            for now.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="secondary">
              <Link href="/work">View case studies</Link>
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
