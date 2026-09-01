import fs from "node:fs"
import path from "node:path"

import type { Metadata } from "next"
import Link from "next/link"

import { AccentBar } from "@/components/ui/accent-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/content/section"
import { DownloadResumeButton } from "@/components/content/download-resume-button"
import { getAllProjects } from "@/lib/content/projects"

export const metadata: Metadata = {
  title: "Resume",
  description: "Professional summary, experience, skills, and selected projects.",
}

function resumePdfExists(): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"))
}

export default function ResumePage() {
  const hasPdf = resumePdfExists()
  const projects = getAllProjects()

  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <AccentBar width="md" className="mb-6" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-h1 font-bold text-purple">Resume</h1>
        {hasPdf ? (
          <DownloadResumeButton />
        ) : (
          <Button
            variant="secondary"
            disabled
            title="PDF version coming soon"
            aria-disabled="true"
          >
            Download PDF (coming soon)
          </Button>
        )}
      </div>
      <p className="mt-4 max-w-2xl text-body text-foreground">
        Senior Full-Stack Software Engineer · Technical Lead · Engineering Leader
      </p>

      <div className="mt-4 divide-y divide-border">
        <Section title="Professional Summary">
          <p>
            Senior full-stack software engineer and technical lead with 10+ years of
            experience delivering enterprise platforms across financial services and HR
            technology. Built and operated customer-facing applications, improved API
            performance for high-traffic services, modernized legacy platforms, and designed
            cloud-native microservices that support business-critical workflows. Brings strong
            frontend, backend, AWS, API, and cross-functional leadership experience across
            Agile delivery teams. Currently open to new opportunities.
          </p>
        </Section>

        <Section title="Experience">
          <ul className="space-y-8">
            <li>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">
                  Lead Application Developer, ADP
                </span>
                <span className="text-small text-muted">Feb 2020 – 2026</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-foreground">
                <li>
                  Built and maintained the customer-facing ADP community platform supporting
                  collaboration features across chat, feed, surveys, broadcasts, analytics, and
                  administrative experiences.
                </li>
                <li>
                  Designed, developed, and launched a new NestJS microservice for
                  customer-facing capabilities from architecture through production deployment,
                  making technical decisions around package selection, service structure, and
                  implementation strategy.
                </li>
                <li>
                  Led AWS service setup and configuration for the new platform, including
                  CloudFormation, ECS service wiring, and authentication/authorization endpoint
                  registration.
                </li>
                <li>
                  Modernized a legacy Express.js service, upgraded dependencies, and improved
                  maintainability, security, and runtime efficiency.
                </li>
                <li>
                  Improved API performance for a high-traffic microservice from approximately
                  500 TPS and a 2.5 second response time to approximately 1,350 TPS and a 100
                  millisecond response time through caching and data retrieval reduction.
                </li>
                <li>
                  Migrated media storage from Amazon EFS to Amazon S3 to support multi-region
                  deployment and disaster recovery for a high-traffic service.
                </li>
                <li>
                  Modernized Angular administrative modules into Stencil.js micro-frontends,
                  enabling incremental platform modernization and reducing maintenance
                  overhead.
                </li>
                <li>
                  Delivered new Angular-based customer-facing product capabilities for Surveys
                  and Broadcasts, including multilingual survey support, analytics
                  enhancements, and configurable survey experiences.
                </li>
                <li>Supported approximately 2 million API requests per day across customer-facing collaboration features.</li>
                <li>
                  Partnered with Product, UX, QA, and engineering teams to translate
                  requirements into production-ready delivery while contributing architecture
                  reviews, sprint planning, and Agile execution across a 4–8 engineer team.
                </li>
                <li>
                  Mentored engineers, onboarded new team members, and drove quality with Jest
                  unit and integration coverage.
                </li>
              </ul>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "TypeScript",
                  "JavaScript",
                  "Angular",
                  "Stencil.js",
                  "Node.js",
                  "Express.js",
                  "NestJS",
                  "AWS ECS",
                  "Amazon S3",
                  "Amazon EFS",
                  "CloudFormation",
                  "Docker",
                  "MongoDB",
                  "Jest",
                ].map((tech) => (
                  <Badge key={tech} variant="tech">
                    {tech}
                  </Badge>
                ))}
              </div>
            </li>

            <li>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">Team Lead / Manager, Fiserv</span>
                <span className="text-small text-muted">Jan 2019 – Feb 2020</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-foreground">
                <li>
                  Led a cross-functional engineering team supporting enterprise fraud alert
                  platforms for financial institutions.
                </li>
                <li>
                  Managed delivery risks, production support, and cross-team coordination to
                  keep roadmap commitments on track.
                </li>
                <li>
                  Worked with Product Owners and stakeholders to prioritize customer-driven
                  enhancements and migration work.
                </li>
                <li>
                  Supported modernization efforts that moved clients from legacy fraud alert
                  capabilities to current platform workflows.
                </li>
              </ul>
            </li>

            <li>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">UI Team Lead, Fiserv</span>
                <span className="text-small text-muted">Jan 2018 – Dec 2018</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-foreground">
                <li>
                  Led distributed engineering teams across onshore and offshore resources
                  delivering AngularJS and Angular applications across 4–5 product lines for
                  approximately 100 enterprise customers.
                </li>
                <li>
                  Delivered Angular-based UI products and customer-facing experiences across
                  clients ranging from smaller agencies to enterprise accounts with millions of
                  accounts.
                </li>
                <li>
                  Demonstrated new UI capabilities through webinars and customer-facing
                  sessions to support adoption and usage.
                </li>
                <li>
                  Partnered with Product and Business Analysts to translate customer feedback
                  into product enhancements and release priorities.
                </li>
                <li>
                  Mentored developers and established delivery standards for a distributed
                  engineering organization.
                </li>
              </ul>
            </li>

            <li>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">AngularJS Developer, Fiserv</span>
                <span className="text-small text-muted">Jun 2017 – Dec 2018</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-foreground">
                <li>
                  Developed a reusable AngularJS application framework enabling rapid delivery
                  of configurable enterprise web applications.
                </li>
                <li>
                  Built and maintained Jenkins CI/CD pipelines supporting application
                  deployments.
                </li>
                <li>Planned and executed CAT, UAT, and production releases.</li>
              </ul>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Angular", "AngularJS", "Java", "JavaScript", "Jenkins", "Git", "Agile", "Scrum"].map(
                  (tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  )
                )}
              </div>
            </li>

            <li>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">
                  Freelance Full-Stack Web Developer
                </span>
                <span className="text-small text-muted">2016 – 2017</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-foreground">
                <li>Designed and developed custom websites and web applications for multiple clients.</li>
                <li>
                  Built responsive frontend applications and supporting backend services using
                  HTML5, CSS3, JavaScript, PHP, and MySQL.
                </li>
                <li>Implemented CMS and eCommerce solutions using WordPress.</li>
                <li>
                  Gathered client requirements and translated business objectives into
                  technical solutions.
                </li>
                <li>
                  Maintained existing applications while ensuring quality, performance, and
                  reliability.
                </li>
              </ul>
            </li>

            <li>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium text-foreground">
                  Informatica Developer, Accenture
                </span>
                <span className="text-small text-muted">2014 – 2016</span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-foreground">
                <li>
                  Developed internal web applications simplifying enterprise data access for
                  engineering teams.
                </li>
                <li>
                  Created complex Informatica mappings implementing business logic for
                  enterprise data integration.
                </li>
                <li>
                  Developed PL/SQL procedures and one-time remediation scripts supporting
                  production systems.
                </li>
                <li>
                  Optimized ETL workflows while troubleshooting production data issues and
                  transformation logic.
                </li>
              </ul>
            </li>
          </ul>
        </Section>

        <Section title="Technical Skills">
          <div className="space-y-4">
            {[
              {
                label: "Frontend",
                items: [
                  "Angular",
                  "AngularJS",
                  "Stencil.js",
                  "TypeScript",
                  "JavaScript",
                  "HTML",
                  "CSS",
                  "NgRx",
                  "RxJS",
                ],
              },
              {
                label: "Backend",
                items: ["Node.js", "Express.js", "NestJS", "REST APIs", "Microservices", "API Design"],
              },
              {
                label: "Cloud & Infrastructure",
                items: ["AWS ECS", "Amazon S3", "Amazon EFS", "CloudFormation", "Docker"],
              },
              {
                label: "Data & Testing",
                items: ["MongoDB", "Jest", "Unit Testing", "Integration Testing", "SQL"],
              },
              {
                label: "Delivery & Leadership",
                items: [
                  "Git",
                  "Bitbucket",
                  "Jira",
                  "Agile",
                  "Scrum",
                  "CI/CD",
                  "Code Reviews",
                  "Technical Design",
                  "Architecture",
                  "Mentoring",
                ],
              },
            ].map((group) => (
              <div key={group.label}>
                <h3 className="text-small font-semibold uppercase tracking-wide text-muted">
                  {group.label}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.items.map((tech) => (
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
          <Section title="Selected Projects">
            <ul className="space-y-4">
              {projects.map((project) => (
                <li key={project.id}>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <Link
                      href={`/${project.category === "work" ? "work" : "projects"}/${project.slug}`}
                      className="font-medium text-purple underline hover:italic hover:text-[#4A2A5F]"
                    >
                      {project.title}
                    </Link>
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

        <Section title="Education">
          <ul className="space-y-3">
            <li>
              <div className="font-medium text-foreground">
                Master of Science — Computer Information Systems (In Progress)
              </div>
              <div className="text-small text-muted">
                Boston University · Concentration: Web Development
              </div>
            </li>
            <li>
              <div className="font-medium text-foreground">
                Bachelor of Arts — Software and Information Systems (Cum Laude)
              </div>
              <div className="text-small text-muted">
                University of North Carolina at Charlotte · Minor: Mathematics
              </div>
            </li>
          </ul>
        </Section>

        <Section title="Contact">
          <p>
            <a href="mailto:hello@rickiecruz.com" className="text-purple underline hover:italic">
              hello@rickiecruz.com
            </a>{" "}
            · <Link href="/contact" className="text-purple underline hover:italic">
              Start a conversation
            </Link>
          </p>
        </Section>
      </div>
    </main>
  )
}
