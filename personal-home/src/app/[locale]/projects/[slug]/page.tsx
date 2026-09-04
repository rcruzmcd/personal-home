import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProjectDetail } from "@/components/case-study/project-detail"
import { getPersonalProjects, getProjectWithContent } from "@/lib/content/projects"
import { DEFAULT_LOCALE, LOCALES, assertLocale } from "@/lib/i18n/locales"
import { buildAlternates, projectPath } from "@/lib/seo"

// Every slug is generated for every locale: a page with no translation still
// exists, rendering the English write-up behind a notice rather than 404ing a
// reader who switched language mid-article.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getPersonalProjects(locale).map((project) => ({ locale, slug: project.slug }))
  )
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = assertLocale(rawLocale)
  const result = getProjectWithContent("project", slug, locale)
  if (!result) return {}
  const { project, isFallback } = result

  return {
    // seoTitle already includes " | Rickie Cruz" — bypass the layout's
    // title template so it doesn't get appended a second time.
    title: project.seoTitle ? { absolute: project.seoTitle } : project.title,
    description: project.seoDescription ?? project.description,
    // An untranslated page is the English page at a second URL, so point the
    // canonical back at the English one rather than competing with it.
    alternates: isFallback
      ? buildAlternates(projectPath(project), DEFAULT_LOCALE)
      : buildAlternates(projectPath(project), locale),
    openGraph: project.heroImage
      ? { images: [{ url: project.heroImage }] }
      : undefined,
  }
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params
  const result = getProjectWithContent("project", slug, assertLocale(locale))
  if (!result) notFound()

  return (
    <main id="main-content" className="flex-1">
      <ProjectDetail
        project={result.project}
        content={result.content}
        isFallback={result.isFallback}
      />
    </main>
  )
}
