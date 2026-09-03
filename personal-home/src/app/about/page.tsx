import type { Metadata } from "next"
import Link from "next/link"

import { PageHeader } from "@/components/content/page-header"
import { Section } from "@/components/content/section"

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, what I do, and how I work.",
}

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <PageHeader
        title="About"
        description="The person behind the work, not just the resume."
      />

      <div className="mt-4 divide-y divide-border">
        <Section title="Who I am">
          <p>
            I&apos;m Rickie — a software engineer with 10+ years of experience across
            consulting, financial services, HR technology, and engineering leadership. I got
            my start building data integrations at Accenture, grew from developer into a team
            lead and manager at Fiserv, and most recently led application development at ADP.
          </p>
        </Section>

        <Section title="What I do">
          <p>
            My work spans the full stack — data pipelines and backend systems as well as the
            interfaces people actually use — plus the architecture and team leadership that
            keep it all running. I&apos;ve built software as an individual contributor and led
            it as a manager responsible for a team&apos;s output, which shapes how I think
            about tradeoffs between shipping fast and building things that last.
          </p>
        </Section>

        <Section title="How I work">
          <p>
            I like to understand the whole system before I touch a single line of code —
            whether that&apos;s a data pipeline, a team&apos;s workflow, or a codebase
            I&apos;ve inherited. I&apos;d rather spend time understanding how the pieces fit
            together than guess my way through a fix.
          </p>
          <p>
            I got comfortable with ownership early. As a UI team lead at Fiserv, I led
            distributed engineering teams across onshore and offshore resources, delivering
            products to roughly 100 enterprise customers. Coordinating across time zones and
            teams taught me to communicate clearly, flag problems before they become fires, and
            make decisions without waiting for permission.
          </p>
          <p>
            I care about building things that outlast the person who built them — writing code
            with the next person in mind, being upfront about tradeoffs instead of overselling
            a quick fix, and treating maintainability as part of the job, not an afterthought.
          </p>
        </Section>

        <Section title="Experience">
          <p>
            I started at Accenture building Informatica/ETL data integrations, then freelanced
            as a full-stack web developer before joining Fiserv as an AngularJS developer. I
            grew into a UI team lead role leading distributed onshore/offshore teams, then into
            a team lead/manager role running a cross-functional engineering team on Fiserv&apos;s
            fraud alert platform. From there I moved to ADP as a lead application developer,
            focused on hands-on development, from 2020 until July 2026.
          </p>
          <p>
            For the full breakdown, see my{" "}
            <Link href="/resume" className="text-purple underline hover:italic">
              resume
            </Link>
            .
          </p>
        </Section>

        <Section title="Currently">
          <p>
            I&apos;m looking for what&apos;s next, whether that&apos;s a full-time role or
            consulting work with a team that needs it. In the meantime, I&apos;m building out
            this site and doing early work on a personal finance app I&apos;ve wanted to build
            for years. I&apos;m also a Board Member and Director of Digital Operations at
            Chatter, an LGBTQ+ ski and snowboard community organizing toward nonprofit status,
            where I lead the technical side of things.
          </p>
        </Section>

        <Section title="Outside of work">
          <p>
            I ski. I found Chatter at a moment when I didn&apos;t have gear or know many queer
            people in the sport, and left that first event with friendships and my first Burton
            jacket. These days I&apos;m involved well beyond the mountain — helping plan
            events, setting up infrastructure, and working toward nonprofit status. (More on
            that in the{" "}
            <Link href="/work/chatter-snow" className="text-purple underline hover:italic">
              Chatter case study
            </Link>
            .)
          </p>
          <p>
            When I&apos;m not skiing, I play tennis (not as often as I&apos;d like, but I hold
            my own), and I&apos;ve been consistently training at the gym for three years now —
            this year I picked running back up as my knee&apos;s gotten stronger. I&apos;m
            happiest near water or outdoors in general, which makes paddleboarding a favorite
            summer activity — it&apos;s basically all of the above at once.
          </p>
          <p>
            I also read a lot, somewhere between 5 and 50 books a year depending on how
            life&apos;s going, and I share my apartment with Cleo, a 12-year-old calico who
            runs the place.
          </p>
        </Section>
      </div>
    </main>
  )
}
