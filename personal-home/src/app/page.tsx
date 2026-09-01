import Link from "next/link"

import { AccentBar } from "@/components/ui/accent-bar"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project/project-card"
import { getFeaturedProjects } from "@/lib/content/projects"

export default function Home() {
  const featuredProjects = getFeaturedProjects(3)

  return (
    <main id="main-content" className="flex-1">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <AccentBar width="md" className="mb-6" />
        <h1 className="text-h1 font-bold text-purple">Rickie Cruz</h1>
        <p className="mt-4 max-w-2xl text-h4 font-semibold text-foreground">
          I help you figure out reasonable technology solutions.
        </p>
        <p className="mt-4 max-w-2xl text-body text-foreground">
          Software engineer and technology strategist. I design and build web applications,
          operations platforms, and tools that solve real problems. I help small organizations
          and nonprofits navigate technology without the corporate overhead or unnecessary
          complexity.
        </p>
        <p className="mt-4 max-w-2xl text-small text-muted">
          Currently: rebuilding after a layoff, solving my own financial challenges with code,
          and helping Chatter Snow scale their operations as Board Member + Director of Digital
          Ops.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="primary">
            <Link href="/work">View my work</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/contact">Let&apos;s talk</Link>
          </Button>
        </div>
      </section>

      {featuredProjects.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-10">
            <AccentBar width="md" className="mb-4" />
            <h2 className="text-h2 font-semibold text-purple">Featured Work</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}
