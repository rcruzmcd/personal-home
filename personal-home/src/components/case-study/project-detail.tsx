import { MDXRemote } from "next-mdx-remote/rsc"

import { AccentBar } from "@/components/ui/accent-bar"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/content/section"
import { DecisionBox } from "@/components/case-study/decision-box"
import { ProjectLinks } from "@/components/case-study/project-links"
import { mdxComponents } from "@/components/mdx/mdx-components"
import { JsonLd } from "@/components/seo/json-ld"
import { TrackProjectView } from "@/components/analytics/track-project-view"
import type { Project } from "@/lib/content/types"
import { statusBadgeVariant, statusLabel } from "@/lib/status"
import { buildProjectJsonLd } from "@/lib/seo"

export function ProjectDetail({
  project,
  content,
}: {
  project: Project
  content: string
}) {
  const cs = project.casestudy
  const personal = project.personalProject

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
      <JsonLd data={buildProjectJsonLd(project)} />
      <TrackProjectView slug={project.slug} category={project.category} />
      <AccentBar width="md" className="mb-6" />

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={statusBadgeVariant(project.status)}>
          {statusLabel(project.status)}
        </Badge>
        {project.technologies.map((tech) => (
          <Badge key={tech} variant="tech">
            {tech}
          </Badge>
        ))}
      </div>

      <h1 className="mt-4 text-h1 font-bold text-purple">{project.title}</h1>

      {project.role ? (
        <p className="mt-2 text-small text-muted">
          {project.role}
          {project.organization ? ` · ${project.organization}` : ""}
        </p>
      ) : null}

      <p className="mt-6 max-w-2xl text-h4 font-semibold text-foreground">
        {project.description}
      </p>

      <ProjectLinks slug={project.slug} links={project.links} />

      {cs ? (
        <div className="mt-8 divide-y divide-border">
          <Section title="Problem">
            <p>{cs.problem}</p>
          </Section>

          <Section title="Context">
            <p>{cs.context}</p>
          </Section>

          <Section title="Goals">
            <ul className="list-disc space-y-2 pl-6">
              {cs.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </Section>

          <Section title="Constraints">
            <ul className="list-disc space-y-2 pl-6">
              {cs.constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </Section>

          {cs.research ? (
            <Section title="Research & Discovery">
              <p>{cs.research}</p>
            </Section>
          ) : null}

          {cs.architecture ? (
            <Section title="Architecture">
              <p>{cs.architecture}</p>
            </Section>
          ) : null}

          {cs.design ? (
            <Section title="Design">
              <p>{cs.design}</p>
            </Section>
          ) : null}

          {cs.implementation ? (
            <Section title="Implementation">
              <p>{cs.implementation}</p>
            </Section>
          ) : null}

          <Section title="Challenges">
            <ul className="list-disc space-y-2 pl-6">
              {cs.challenges.map((challenge) => (
                <li key={challenge}>{challenge}</li>
              ))}
            </ul>
          </Section>

          {cs.decisions.length > 0 ? (
            <Section title="Decisions">
              <div className="space-y-4">
                {cs.decisions.map((decision) => (
                  <DecisionBox key={decision.title} decision={decision} />
                ))}
              </div>
            </Section>
          ) : null}

          {cs.metrics && cs.metrics.length > 0 ? (
            <Section title="Metrics">
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {cs.metrics.map((metric) => (
                  <div key={metric.metric}>
                    <dt className="text-small text-muted">{metric.metric}</dt>
                    <dd className="text-h4 font-semibold text-foreground">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>
          ) : null}

          <Section title="Result">
            <p>{cs.result}</p>
          </Section>

          <Section title="Lessons Learned">
            <ul className="list-disc space-y-2 pl-6">
              {cs.lessonLearned.map((lesson) => (
                <li key={lesson}>{lesson}</li>
              ))}
            </ul>
          </Section>
        </div>
      ) : personal ? (
        <div className="mt-8 divide-y divide-border">
          <Section title="What It Does">
            <p>{personal.whatItDoes}</p>
          </Section>

          <Section title="Why I Built It">
            <p>{personal.whyIBuiltIt}</p>
          </Section>

          {personal.technicalDecisions.length > 0 ? (
            <Section title="Technical Decisions">
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
        <div className="mt-8 border-t border-border pt-8">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      ) : null}
    </article>
  )
}
