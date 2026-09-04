import { locale as rootLocale } from "next/root-params"

import { AccentBar } from "@/components/ui/accent-bar"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/content/page-header"
import { ProjectCard } from "@/components/project/project-card"
import { getFeaturedProjects } from "@/lib/content/projects"
import { LocaleLink } from "@/components/i18n/locale-link"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"

export default async function Home() {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)
  const featuredProjects = getFeaturedProjects(locale, 3)

  return (
    <main id="main-content" className="flex-1">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        {/* No header stats or header actions here: the hero *is* the page's
            headline content, and its CTAs stack below the copy rather than
            being pulled into the title row (docs/UX_PATTERNS.md §2). */}
        <PageHeader
          title={t.common.siteName}
          description={
            <>
              <p className="text-h4 font-semibold">{t.home.tagline}</p>
<p className="mt-4">{t.home.intro}</p>
<p className="mt-4 text-small text-muted">{t.home.currently}</p>
            </>
          }
        />
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button asChild variant="primary">
            <LocaleLink href="/work">{t.home.viewWork}</LocaleLink>
          </Button>
          <Button asChild variant="secondary">
            <LocaleLink href="/contact">{t.home.letsTalk}</LocaleLink>
          </Button>
        </div>
      </section>

      {featuredProjects.length > 0 ? (
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-10">
            <AccentBar width="md" className="mb-4" />
            <h2 className="text-h2 font-semibold text-purple">{t.home.featuredWork}</h2>
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
