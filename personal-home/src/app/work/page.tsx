import type { Metadata } from "next"

import { AccentBar } from "@/components/ui/accent-bar"
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
      <AccentBar width="md" className="mb-6" />
      <h1 className="text-h1 font-bold text-purple">Work</h1>
      <p className="mt-4 max-w-2xl text-body text-foreground">
        Case studies from professional and volunteer engineering work — how the problem was
        understood, what was built, and what trade-offs shaped the result.
      </p>

      {projects.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} titleAs="h2" />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-body text-muted">No case studies published yet.</p>
      )}
    </main>
  )
}
