import fs from "node:fs"
import path from "node:path"

import type { Metadata } from "next"
import Link from "next/link"

import { AccentBar } from "@/components/ui/accent-bar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/content/section"
import { PlaceholderNote } from "@/components/content/placeholder-note"
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

      <div className="mt-4 divide-y divide-border">
        <Section title="Professional Summary">
          <PlaceholderNote>
            [Placeholder — Rickie to write a current professional summary here.]
          </PlaceholderNote>
        </Section>

        <Section title="Experience">
          <PlaceholderNote>
            [Placeholder — Rickie to add professional experience/work history here.]
          </PlaceholderNote>
        </Section>

        <Section title="Technical Skills">
          <PlaceholderNote>
            [Placeholder — Rickie to add a technical skills list here.]
          </PlaceholderNote>
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
          <PlaceholderNote>[Placeholder — Rickie to add education here.]</PlaceholderNote>
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
