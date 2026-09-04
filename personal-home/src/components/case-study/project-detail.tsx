import { MDXRemote } from "next-mdx-remote/rsc"
import { locale as rootLocale } from "next/root-params"

import { Badge } from "@/components/ui/badge"
import { Stat } from "@/components/ui/stat"
import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"
import { DecisionBox } from "@/components/case-study/decision-box"
import { ProjectLinks } from "@/components/case-study/project-links"
import { mdxComponents } from "@/components/mdx/mdx-components"
import { JsonLd } from "@/components/seo/json-ld"
import { TrackProjectView } from "@/components/analytics/track-project-view"
import type { Project } from "@/lib/content/types"
import { formatDate, lastModified } from "@/lib/date"
import { statusBadgeVariant } from "@/lib/status"
import { buildProjectJsonLd, projectHref } from "@/lib/seo"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { assertLocale } from "@/lib/i18n/locales"

export async function ProjectDetail({
  project,
  content,
  isFallback = false,
}: {
  project: Project
  content: string
  /** True when the English write-up is standing in for a missing translation. */
  isFallback?: boolean
}) {
  const locale = assertLocale(await rootLocale())
  const t = await getDictionary(locale)
  const cs = project.casestudy
  const personal = project.personalProject

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
      <JsonLd data={buildProjectJsonLd(project, locale)} />
      <TrackProjectView slug={project.slug} category={project.category} />
      {/* The trail sits above the title, not as a "Back to Work" link below it
          — it's this page's location cue and its way out (docs/UX_PATTERNS.md). */}
      <PageHeader
        title={project.title}
        breadcrumb={[
          {
            label: project.category === "work" ? t.work.title : t.projects.title,
            href: projectHref(project.category),
          },
        ]}
        eyebrow={
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={statusBadgeVariant(project.status)}>
              {t.status[project.status]}
            </Badge>
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="tech">
                {tech}
              </Badge>
            ))}
          </div>
        }
        description={
          <>
            {project.role ? (
              <p className="text-small text-muted">
                {project.role}
                {project.organization ? ` · ${project.organization}` : ""}
              </p>
            ) : null}
            {/* Case studies here are living documents — an active project's
                page gets revised as the work does, so say when it last was. */}
            <p className="text-small text-muted">
              {project.updatedDate ? `${t.caseStudy.updated} ` : `${t.caseStudy.published} `}
              <time dateTime={lastModified(project)}>
                {formatDate(lastModified(project), locale)}
              </time>
            </p>
            <p className="mt-4 text-h4 font-semibold">{project.description}</p>
          </>
        }
      />

      {isFallback ? (
        <p
          className="mt-8 rounded-md border border-border bg-surface px-4 py-3 text-small text-muted"
        >
          {t.caseStudy.untranslatedNotice}
        </p>
      ) : null}

      <ProjectLinks slug={project.slug} links={project.links} />

      {cs ? (
        <div className="mt-8 divide-y divide-border" lang={isFallback ? "en" : undefined}>
          <Section title={t.caseStudy.problem}>
            <p>{cs.problem}</p>
          </Section>

          <Section title={t.caseStudy.context}>
            <p>{cs.context}</p>
          </Section>

          <Section title={t.caseStudy.goals}>
            <ul className="list-disc space-y-2 pl-6">
              {cs.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </Section>

          <Section title={t.caseStudy.constraints}>
            <ul className="list-disc space-y-2 pl-6">
              {cs.constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </Section>

          {cs.research ? (
            <Section title={t.caseStudy.research}>
              <p>{cs.research}</p>
            </Section>
          ) : null}

          {cs.architecture ? (
            <Section title={t.caseStudy.architecture}>
              <p>{cs.architecture}</p>
            </Section>
          ) : null}

          {cs.design ? (
            <Section title={t.caseStudy.design}>
              <p>{cs.design}</p>
            </Section>
          ) : null}

          {cs.implementation ? (
            <Section title={t.caseStudy.implementation}>
              <p>{cs.implementation}</p>
            </Section>
          ) : null}

          <Section title={t.caseStudy.challenges}>
            <ul className="list-disc space-y-2 pl-6">
              {cs.challenges.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
          </Section>

          {cs.decisions.length > 0 ? (
            <Section title={t.caseStudy.decisions}>
              <div className="space-y-4">
                {cs.decisions.map((decision) => (
                  <DecisionBox key={decision.title} decision={decision} />
                ))}
              </div>
            </Section>
          ) : null}

          {cs.metrics && cs.metrics.length > 0 ? (
            <Section title={t.caseStudy.metrics}>
              {/* These stay in the body rather than moving into the page
                  header: a figure belongs in one place, and here it's evidence
                  in the narrative, not the page's status. */}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {cs.metrics.map((metric) => (
                  <Stat
                    key={metric.metric}
                    label={metric.metric}
                    value={metric.value}
                    tone="accent"
                    size="sm"
                  />
                ))}
              </div>
            </Section>
          ) : null}

          <Section title={t.caseStudy.result}>
            <p>{cs.result}</p>
          </Section>

          <Section title={t.caseStudy.lessonsLearned}>
            <ul className="list-disc space-y-2 pl-6">
              {cs.lessonLearned.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </Section>
        </div>
      ) : personal ? (
        <div className="mt-8 divide-y divide-border" lang={isFallback ? "en" : undefined}>
          <Section title={t.caseStudy.whatItDoes}>
            <p>{personal.whatItDoes}</p>
          </Section>

          <Section title={t.caseStudy.whyIBuiltIt}>
            <p>{personal.whyIBuiltIt}</p>
          </Section>

          {personal.technicalDecisions.length > 0 ? (
            <Section title={t.caseStudy.technicalDecisions}>
              <ul className="list-disc space-y-2 pl-6">
                {personal.technicalDecisions.map((decision) => (
                  <li key={decision}>{decision}</li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      ) : null}

      {content.trim() ? (
        <div className="mt-8 border-t border-border pt-8" lang={isFallback ? "en" : undefined}>
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      ) : null}
    </article>
  )
}
