import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { Button } from "@/components/ui/button"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { ProjectCard } from "@/components/project/project-card"
import { getPersonalProjects } from "@/lib/content/projects"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { buildAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.projects.metaTitle,
    description: t.projects.metaDescription,
    alternates: buildAlternates("/projects", locale),
  }
}

export default async function ProjectsPage() {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)
  const projects = getPersonalProjects(locale)

  return (
    <main id="main-content" className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader title={t.projects.title} description={t.projects.description} />

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
          <p className="text-body text-muted">{t.projects.empty}</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="secondary">
              <LocaleLink href="/work">{t.projects.viewCaseStudies}</LocaleLink>
            </Button>
            <Button asChild variant="secondary">
              <LocaleLink href="/contact">{t.projects.getInTouch}</LocaleLink>
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}
