import fs from "node:fs"
import path from "node:path"

import type { Metadata } from "next"
import { locale as rootLocale } from "next/root-params"

import { Badge } from "@/components/ui/badge"
import { LocaleLink } from "@/components/i18n/locale-link"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { DownloadResumeButton } from "@/components/content/download-resume-button"
import { PrintResumeButton } from "@/components/content/print-resume-button"
import { getAllProjects } from "@/lib/content/projects"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"
import {
  EDUCATION,
  RESUME_ROLES,
  ROLE_TECHNOLOGIES,
  SKILL_GROUPS,
  SKILL_ITEMS,
} from "@/lib/resume"
import { buildAlternates, projectPath } from "@/lib/seo"

function resumePdfExists(): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)

  return {
    title: t.resume.metaTitle,
    description: t.resume.metaDescription,
    alternates: buildAlternates("/resume", locale),
  }
}

export default async function ResumePage() {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)
  const r = t.resume
  const hasPdf = resumePdfExists()
  const projects = getAllProjects(locale)

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      {/* The site header is hidden when printing, so the printed page would
          otherwise carry no name. This block only exists on paper. */}
      <div className="hidden print:block">
        <h1 className="text-h2 font-semibold text-foreground">{t.common.siteName}</h1>
        <p className="text-small text-muted">{r.subtitle}</p>
        <p className="text-small text-muted">rickiecruz.com</p>
      </div>

      <div className="print:hidden">
        <PageHeader
          title={r.title}
          description={r.subtitle}
          actions={
            <div className="flex flex-wrap gap-3">
              <PrintResumeButton />
              {hasPdf ? <DownloadResumeButton /> : null}
            </div>
          }
        />
      </div>

      <div className="mt-4 divide-y divide-border">
        <Section title={r.summaryHeading}>
          <p>{r.summary}</p>
        </Section>

        <Section title={r.experienceHeading}>
          <ul className="space-y-8 print:space-y-6">
            {RESUME_ROLES.map((key) => {
              const role = r.roles[key]
              const technologies = ROLE_TECHNOLOGIES[key]

              return (
                <li key={key}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium text-foreground">{role.title}</span>
                    <span className="text-small text-muted">{role.period}</span>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-foreground">
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {technologies ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {technologies.map((tech) => (
                        <Badge key={tech} variant="tech">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </Section>

        <Section title={r.skillsHeading}>
          <div className="space-y-4">
            {SKILL_GROUPS.map((group) => (
              <div key={group}>
                <h3 className="text-small font-semibold uppercase tracking-wide text-muted">
                  {r.skillGroups[group]}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SKILL_ITEMS[group].map((tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {projects.length > 0 ? (
          <Section title={r.selectedProjectsHeading}>
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <LocaleLink
                      href={projectPath(project)}
                      className="font-medium text-purple underline hover:italic hover:text-[#4A2A5F]"
                    >
                      {project.title}
                    </LocaleLink>
                    {project.role ? (
                      <span className="text-small text-muted">{project.role}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-small text-foreground">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="tech">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section title={r.educationHeading}>
          <ul className="space-y-3">
            {EDUCATION.map((key) => (
              <li key={key}>
                <div className="font-medium text-foreground">{r.education[key].degree}</div>
                <div className="text-small text-muted">{r.education[key].detail}</div>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={r.contactHeading}>
          <p>
            <LocaleLink href="/contact" className="text-purple underline hover:italic">
              {r.startConversation}
            </LocaleLink>
          </p>
        </Section>
      </div>
    </main>
  )
}
