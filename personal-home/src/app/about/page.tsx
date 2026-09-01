import type { Metadata } from "next"
import Link from "next/link"

import { AccentBar } from "@/components/ui/accent-bar"
import { Section } from "@/components/content/section"

export const metadata: Metadata = {
  title: "About",
  description: "Who I am, what I do, and how I work.",
}

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-3xl flex-1 px-4 py-16 sm:px-6 lg:px-10">
      <AccentBar width="md" className="mb-6" />
      <h1 className="text-h1 font-bold text-purple">About</h1>
      <p className="mt-4 max-w-2xl text-body text-foreground">
        The person behind the work, not just the resume.
      </p>

      <div className="mt-4 divide-y divide-border">
        <Section title="Who I am">
          <p>
            I&apos;m Rickie — a software engineer with 10+ years of experience across
            consulting, financial services, HR technology, and engineering leadership. I got
            my start building data integrations at Accenture, grew from developer into a team
            lead and manager at Fiserv, and most recently led application development at ADP.
            Outside of work, I&apos;m a skier and a volunteer with the LGBTQ+ ski and snowboard
            community.
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
            focused on hands-on development, from 2020 until being laid off this year.
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
            I was laid off from ADP last month, and I&apos;m currently looking for what&apos;s
            next. In the meantime, I&apos;m building out this site, doing early work on a
            personal finance app I&apos;ve wanted to build for years, and volunteering behind
            the scenes for Chatter — building their website and the systems that keep events
            running.
          </p>
        </Section>

        <Section title="Outside of work">
          <p>
            I&apos;m a skier — or, as my friend Sofie likes to say, &ldquo;our token
            skier.&rdquo;
          </p>
          <p>
            I have a special relationship with Chatter, an LGBTQ+ ski and snowboard community.
            We both got serious around the same time: when Chatter held its first event, I had
            no gear of my own and knew very few queer people in the ski and snowboard
            community. By the end of that event, I&apos;d made friendships that have helped me
            become a better skier — and somehow walked away with my first Burton jacket.
          </p>
          <p>
            I got involved with Chatter in late 2025, initially helping with social media and
            eventually helping put events together. Behind the scenes, I get to put my
            engineering experience to use building the website, organizing systems, and
            figuring out how to make all the moving pieces work.
          </p>
          <p>
            For me, Chatter is about more than just getting on the mountain. It&apos;s about
            the people you meet, the friendships you make, and finding a community that makes
            you want to keep showing up — on and off the mountain. And yes, I&apos;m still one
            of the token skiers... for now.
          </p>
        </Section>
      </div>
    </main>
  )
}
