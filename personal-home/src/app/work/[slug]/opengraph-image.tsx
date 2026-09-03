import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"

import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, ogFonts } from "@/lib/og"
import { getProject, getWorkProjects } from "@/lib/content/projects"

export function generateStaticParams() {
  return getWorkProjects().map((project) => ({ slug: project.slug }))
}

export const alt = "Case study preview"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject("work", slug)
  if (!project) notFound()

  return new ImageResponse(
    <OgFrame eyebrow="Work" title={project.title} description={project.description} />,
    { ...size, fonts: ogFonts() }
  )
}
