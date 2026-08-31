import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ProjectDetail } from "@/components/case-study/project-detail"
import { getPersonalProjects, getProjectWithContent } from "@/lib/content/projects"

export function generateStaticParams() {
  return getPersonalProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const result = getProjectWithContent("project", slug)
  if (!result) return {}
  const { project } = result

  return {
    // seoTitle already includes " | Rickie Cruz" — bypass the layout's
    // title template so it doesn't get appended a second time.
    title: project.seoTitle ? { absolute: project.seoTitle } : project.title,
    description: project.seoDescription ?? project.description,
    openGraph: project.heroImage
      ? { images: [{ url: project.heroImage }] }
      : undefined,
  }
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params
  const result = getProjectWithContent("project", slug)
  if (!result) notFound()

  return (
    <main id="main-content" className="flex-1">
      <ProjectDetail project={result.project} content={result.content} />
    </main>
  )
}
