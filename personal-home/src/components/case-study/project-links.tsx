"use client"

import { trackExternalProjectClick } from "@/lib/analytics"
import type { Project } from "@/lib/content/types"

export function ProjectLinks({
  slug,
  links,
}: {
  slug: string
  links: Project["links"]
}) {
  if (links.length === 0) return null

  return (
    <div className="mt-6 flex flex-wrap gap-4">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackExternalProjectClick({ slug, url: link.url, linkType: link.type })
          }
          className="text-body font-medium text-purple underline transition-colors duration-200 hover:italic hover:text-[#4A2A5F]"
        >
          {link.title} &rarr;
        </a>
      ))}
    </div>
  )
}
