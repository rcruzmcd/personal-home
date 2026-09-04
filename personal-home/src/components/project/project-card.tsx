import { locale as rootLocale } from "next/root-params"

import { AccentBar } from "@/components/ui/accent-bar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Project } from "@/lib/content/types"
import { statusBadgeVariant } from "@/lib/status"
import { projectPath } from "@/lib/seo"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import { LocaleLink } from "@/components/i18n/locale-link"

export async function ProjectCard({
  project,
  featured = false,
  titleAs: TitleTag = "h3",
}: {
  project: Project
  featured?: boolean
  // Default h3 assumes the card sits under an h2 section heading (e.g. the
  // homepage's "Featured Work"). Listing pages with no such h2 between
  // their h1 and the card grid should pass "h2" to avoid skipping a level.
  titleAs?: "h2" | "h3"
}) {
  const t = await getDictionary(assertLocale(await rootLocale()))
  const subheading = project.category === "work" ? project.role : undefined

  return (
    <Card variant={featured ? "featured" : "standard"} className="flex flex-col">
      <CardHeader>
        <AccentBar width={featured ? "md" : "sm"} className="mb-4" />
        <CardAction>
          <Badge variant={statusBadgeVariant(project.status)}>
            {t.status[project.status]}
          </Badge>
        </CardAction>
        <CardTitle asChild>
          <TitleTag>{project.title}</TitleTag>
        </CardTitle>
        {subheading ? <CardDescription>{subheading}</CardDescription> : null}
      </CardHeader>

      <CardContent className="flex-1">
        <p>{project.description}</p>
      </CardContent>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <Badge key={tech} variant="tech">
            {tech}
          </Badge>
        ))}
      </div>

      <CardFooter>
        <LocaleLink
          href={projectPath(project)}
          className="text-body font-medium text-purple underline transition-colors duration-200 hover:italic hover:text-[#4A2A5F]"
        >
          {t.common.readCaseStudy} &rarr;
        </LocaleLink>
      </CardFooter>
    </Card>
  )
}
