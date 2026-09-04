// The canonical string catalog. Its shape is the contract every other locale
// must satisfy: `es.ts` is typed as `Dictionary`, so a key added here that is
// missing there fails `bun run build` rather than rendering an English string
// on a Spanish page.
//
// The `client` namespace is the only part shipped to the browser (see
// I18nProvider) — keep long-form page prose out of it.
//
// Deliberately NOT `as const`: literal types here would make `Dictionary`
// demand the *same* strings in every locale, so `es.ts` could only ever
// type-check by repeating the English copy verbatim.
export const en = {
  client: {
    nav: {
      ariaLabel: "Primary",
      work: "Work",
      projects: "Projects",
      about: "About",
      consulting: "Consulting",
      contact: "Contact",
    },
    mobileNav: {
      close: "Close",
      open: "Open menu",
      title: "Menu",
    },
    themeToggle: {
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
    },
    error: {
      title: "Something went wrong",
      description:
        "This page failed to load. Trying again usually works — if it doesn't, let me know what you were looking for.",
      tryAgain: "Try again",
      backHome: "Back to home",
      report: "Report the problem",
      reference: "Reference:",
    },
    contactForm: {
      // Zod messages. Kept alongside the rest of the form copy so a field's
      // label and its error read as one voice.
      errors: {
        nameRequired: "Name is required.",
        emailInvalid: "Enter a valid email address.",
        reasonRequired: "Choose what you'd like help with.",
        messageTooShort: "Message must be at least 10 characters.",
        generic: "Something went wrong. Please try again.",
      },
      reasons: {
        consulting: "Consulting",
        "website-application": "Website / application",
        "technical-question": "Technical question",
        collaboration: "Collaboration",
        employment: "Employment",
        other: "Other",
      },
      honeypotLabel: "Leave this field blank",
      name: "Name",
      email: "Email",
      organization: "Organization",
      reasonLegend: "What can I help with?",
      message: "Message",
      submit: "Start a conversation",
      submitting: "Sending…",
      successTitle: "Thanks — your message is on its way.",
      successBody: "I'll get back to you soon.",
    },
    downloadResume: "Download PDF",
    printResume: "Print / Save as PDF",
    localeSwitcher: {
      ariaLabel: "Language",
    },
  },

  common: {
    skipToContent: "Skip to content",
    readCaseStudy: "Read case study",
    siteName: "Rickie Cruz",
    jobTitle: "Software Engineer",
    siteDescription:
      "Software engineer who builds useful digital products and helps organizations make better technology decisions.",
  },

  status: {
    active: "Active",
    experiment: "Experiment",
    completed: "Completed",
    archived: "Archived",
  },

  // Section headings for a case study or personal project write-up. The prose
  // under each comes from the entry's own frontmatter; only the headings live
  // here.
  caseStudy: {
    published: "Published",
    updated: "Updated",
    ogAlt: "Case study preview",
    problem: "Problem",
    context: "Context",
    goals: "Goals",
    constraints: "Constraints",
    research: "Research & Discovery",
    architecture: "Architecture",
    design: "Design",
    implementation: "Implementation",
    challenges: "Challenges",
    decisions: "Decisions",
    metrics: "Metrics",
    result: "Result",
    lessonsLearned: "Lessons Learned",
    whatItDoes: "What It Does",
    whyIBuiltIt: "Why I Built It",
    technicalDecisions: "Technical Decisions",
    // Shown when a locale has no translation for this entry and the English
    // write-up is standing in.
    untranslatedNotice: "This case study hasn't been translated yet — it's shown below in English.",
  },

  home: {
    tagline: "I help you figure out reasonable technology solutions.",
    intro:
      "Software engineer and technology strategist. I design and build web applications, operations platforms, and tools that solve real problems. I help small organizations and nonprofits navigate technology without the corporate overhead or unnecessary complexity.",
    currently:
      "Currently: rebuilding after a layoff, solving my own financial challenges with code, and helping Chatter Snow scale their operations as Board Member + Director of Digital Ops.",
    viewWork: "View my work",
    letsTalk: "Let's talk",
    featuredWork: "Featured Work",
  },

  work: {
    metaTitle: "Work",
    metaDescription: "Case studies from professional and volunteer engineering work.",
    title: "Work",
    description:
      "Case studies from professional and volunteer engineering work — how the problem was understood, what was built, and what trade-offs shaped the result.",
    empty: "No case studies published yet — personal projects are written up in the meantime.",
    browseProjects: "Browse projects",
    getInTouch: "Get in touch",
  },

  projects: {
    metaTitle: "Projects",
    metaDescription: "Personal projects — what they do, why they were built, and how.",
    title: "Projects",
    description:
      "Personal projects, separate from professional work — built to learn something, solve a real problem, or explore an idea.",
    empty: "No projects published yet — the professional case studies are the fuller read for now.",
    viewCaseStudies: "View case studies",
    getInTouch: "Get in touch",
  },

  contact: {
    metaTitle: "Contact",
    metaDescription: "Start a conversation about consulting, a project, or a question.",
    title: "Get in touch",
    description:
      "Whether it's a consulting question, a project idea, or something else entirely — tell me a bit about it below.",
  },

  notFound: {
    metaTitle: "Page not found",
    eyebrow: "404",
    title: "Page not found",
    description:
      "That page doesn't exist, or it moved. The links below cover everything on the site.",
    backHome: "Back to home",
    viewWork: "View my work",
  },

  about: {
    metaTitle: "About",
    metaDescription: "Who I am, what I do, and how I work.",
    title: "About",
    description: "The person behind the work, not just the resume.",

    whoIAm: {
      heading: "Who I am",
      body: "I'm Rickie — a software engineer with 10+ years of experience across consulting, financial services, HR technology, and engineering leadership. I got my start building data integrations at Accenture, grew from developer into a team lead and manager at Fiserv, and most recently led application development at ADP.",
    },

    whatIDo: {
      heading: "What I do",
      body: "My work spans the full stack — data pipelines and backend systems as well as the interfaces people actually use — plus the architecture and team leadership that keep it all running. I've built software as an individual contributor and led it as a manager responsible for a team's output, which shapes how I think about tradeoffs between shipping fast and building things that last.",
    },

    howIWork: {
      heading: "How I work",
      systems:
        "I like to understand the whole system before I touch a single line of code — whether that's a data pipeline, a team's workflow, or a codebase I've inherited. I'd rather spend time understanding how the pieces fit together than guess my way through a fix.",
      ownership:
        "I got comfortable with ownership early. As a UI team lead at Fiserv, I led distributed engineering teams across onshore and offshore resources, delivering products to roughly 100 enterprise customers. Coordinating across time zones and teams taught me to communicate clearly, flag problems before they become fires, and make decisions without waiting for permission.",
      durability:
        "I care about building things that outlast the person who built them — writing code with the next person in mind, being upfront about tradeoffs instead of overselling a quick fix, and treating maintainability as part of the job, not an afterthought.",
    },

    experience: {
      heading: "Experience",
      body: "I started at Accenture building Informatica/ETL data integrations, then freelanced as a full-stack web developer before joining Fiserv as an AngularJS developer. I grew into a UI team lead role leading distributed onshore/offshore teams, then into a team lead/manager role running a cross-functional engineering team on Fiserv's fraud alert platform. From there I moved to ADP as a lead application developer, focused on hands-on development, from 2020 until July 2026.",
      // Split around the inline link so the sentence can be reordered per
      // language rather than concatenated from fixed fragments.
      resumeLinkPrefix: "For the full breakdown, see my ",
      resumeLinkLabel: "resume",
      resumeLinkSuffix: ".",
    },

    currently: {
      heading: "Currently",
      body: "I'm looking for what's next, whether that's a full-time role or consulting work with a team that needs it. In the meantime, I'm building out this site and doing early work on a personal finance app I've wanted to build for years. I'm also a Board Member and Director of Digital Operations at Chatter, an LGBTQ+ ski and snowboard community organizing toward nonprofit status, where I lead the technical side of things.",
    },

    outsideOfWork: {
      heading: "Outside of work",
      skiingPrefix:
        "I ski. I found Chatter at a moment when I didn't have gear or know many queer people in the sport, and left that first event with friendships and my first Burton jacket. These days I'm involved well beyond the mountain — helping plan events, setting up infrastructure, and working toward nonprofit status. (More on that in the ",
      skiingLinkLabel: "Chatter case study",
      skiingSuffix: ".)",
      sports:
        "When I'm not skiing, I play tennis (not as often as I'd like, but I hold my own), and I've been consistently training at the gym for three years now — this year I picked running back up as my knee's gotten stronger. I'm happiest near water or outdoors in general, which makes paddleboarding a favorite summer activity — it's basically all of the above at once.",
      reading:
        "I also read a lot, somewhere between 5 and 50 books a year depending on how life's going, and I share my apartment with Cleo, a 12-year-old calico who runs the place.",
    },
  },

  consulting: {
    metaTitle: "Consulting",
    metaDescription:
      "Technology assessments, websites and web applications, technical strategy, and internal tools for small organizations.",
    title: "Consulting",
    intro:
      "Technology shouldn't be a source of confusion. I help small organizations and nonprofits figure out what you actually need—without unnecessary complexity or corporate overhead. I've done this work (Board Member + Director of Digital Ops at Chatter Snow), and I understand your constraints.",

    howThisWorks: {
      heading: "How this works",
      conversation:
        "Start with a conversation. 30 minutes, no pressure. You tell me what's broken or confusing about your technology. I listen.",
      deeper: "If it makes sense to go deeper, we figure out what that looks like together.",
    },

    servicesHeading: "Services",
    // Keyed rather than a bare array so the compiler still checks that every
    // service exists in each locale; only the prose inside varies.
    services: {
      healthCheck: {
        title: "Technology Health Check",
        price: "Starting at $150–350 (nonprofit) or $350–500 (small business)",
        description: ["Comprehensive review of your technology ecosystem."],
        details: [
          { label: "Deliverable", value: "Assessment + prioritized roadmap" },
          {
            label: "Covers",
            value:
              "Website, hosting, DNS, email, SaaS, security, access, analytics, payments, storage, backups, and costs.",
          },
        ],
      },
      websites: {
        title: "Website & Web Applications",
        price: "Starting at $1,500",
        description: [
          "Modern websites and custom applications for organizations that have outgrown templates.",
        ],
        details: [
          { label: "Deliverable", value: "Scoped estimate and timeline" },
          {
            label: "For",
            value:
              "Growing nonprofits, small businesses, or organizations needing something specific to your workflow.",
          },
        ],
      },
      strategy: {
        title: "Technical Strategy",
        price: "Starting at $100/hour",
        description: [
          'The question you actually need answered: "What should we use and why?"',
          "We map your constraints (budget, team, timeline, growth), review your options, and build a strategy that makes sense for you right now—not what looks good in a case study.",
        ],
        details: [
          {
            label: "Covers",
            value:
              "Technology selection, architecture, cloud infrastructure, integrations, data, authentication, automation.",
          },
        ],
      },
      internalTools: {
        title: "Internal Tools",
        price: "Starting at $1,500 (small tools), $5,000+ (larger systems)",
        description: [
          "Replace spreadsheets, manual workflows, and repetitive tasks with lightweight tools that actually work for your team.",
        ],
        details: [
          {
            label: "Examples",
            value:
              "Member management systems, inventory trackers, team dashboards, intake forms, approval workflows, reporting tools.",
          },
        ],
      },
    },

    nonprofit: {
      heading: "Nonprofit & Community Support",
      belief:
        "I believe small organizations should have access to good technology even when resources are limited.",
      offer:
        "I offer reduced-rate consulting to nonprofits and community organizations, with limited pro bono capacity (1–2 projects per quarter).",
      freeHeading: "Free",
      freeBody: "30-minute conversation to understand your situation",
      paidHeading: "Paid",
      paidBody:
        "Anything involving detailed research, written audit, implementation, or ongoing support",
    },

    readyToTalk: "Ready to talk?",
    startConversation: "Start a conversation",
  },

  legal: {
    // Rendered through formatDate so the month name follows the reader's
    // locale instead of being frozen as English text.
    lastUpdated: (date: string) => `Last updated: ${date}`,
  },

  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription: "How rickiecruz.com collects, uses, and protects information.",
    title: "Privacy Policy",

    collects: {
      heading: "What This Site Collects",
      body: "The contact form collects the information you submit — name, email, organization (optional), the category you select, and your message — solely to respond to your inquiry. No account creation or login is required to use this site.",
    },
    analytics: {
      heading: "Analytics",
      body: "This site uses Vercel Analytics, a privacy-conscious, cookie-free analytics service. It reports aggregate page views and a small set of named interaction events (for example, viewing a project or submitting the contact form) without tracking individuals across sites or storing personal identifiers.",
    },
    cookies: {
      heading: "Cookies",
      body: "This site does not use tracking or advertising cookies. A small amount of data may be stored in your browser's local storage only to remember your light/dark mode preference, and a cookie records your language choice if you use the language switcher — both stay on your device and are never used to identify you.",
    },
    thirdParty: {
      heading: "Third-Party Services",
      body: "Contact form submissions may be relayed through a transactional email provider solely to deliver the message. That provider does not use your information for any other purpose.",
    },
    retention: {
      heading: "Data Retention",
      inbox:
        "This site has no database and no user accounts. A contact form submission arrives as an email in my inbox, and that email is the only copy I keep. I hold onto it for as long as it takes to respond and to keep a reasonable record of the conversation afterward — inquiries that don't lead to work are deleted within 24 months. The transactional email provider that relays the message keeps its own short-term delivery logs under its own retention policy.",
      ip: "Your IP address is used only in memory, for a matter of seconds, to rate-limit the contact form against spam. It is never written to a database and is not included in the email I receive. Separately, my hosting provider keeps standard server request logs, which include IP addresses, for a limited period.",
    },
    rights: {
      heading: "Your Rights",
      requestPrefix:
        "You can ask me what information of yours I hold, ask me to correct it, or ask me to delete it. Send the request through the ",
      contactLinkLabel: "contact form",
      requestSuffix:
        " from the same email address you originally wrote in from, and I'll confirm within 30 days. Because the only information I hold is what you typed into that form, honoring a deletion request means deleting the email thread.",
      noSelling:
        "I don't sell or share personal information, and this site runs no advertising, profiling, or cross-site tracking. Depending on where you live, you may have additional statutory rights — for example under the GDPR in the EEA and UK, or the CCPA in California. I handle requests the same way regardless of whether a particular law applies to you.",
    },
    contact: {
      heading: "Contact",
      prefix: "Questions about this policy can be sent via the ",
      linkLabel: "contact form",
      suffix: ".",
    },
  },

  terms: {
    metaTitle: "Terms",
    metaDescription: "Terms of use for rickiecruz.com.",
    title: "Terms",

    use: {
      heading: "Use of This Site",
      body: "This site and its content — including case studies, project write-ups, and any code samples referenced — are provided for informational purposes. You're welcome to read, share, and link to it.",
    },
    ownership: {
      heading: "Content Ownership",
      body: (year: number) =>
        `Unless otherwise noted, the content, design, and branding on this site are © ${year} Rickie Cruz. Project names and logos referenced in case studies (for example, Chatter Snow) belong to their respective organizations.`,
    },
    engagements: {
      heading: "Consulting Engagements",
      offerPrefix:
        "Nothing on this site is an offer, a quote, or a contract. The service descriptions and starting rates on the ",
      consultingLinkLabel: "consulting page",
      offerSuffix:
        " are a starting point for a conversation and are subject to change — actual pricing depends on scope.",
      agreement:
        "Paid work is governed by a separate written agreement covering scope, deliverables, timeline, fees, payment terms, ownership of the work, and confidentiality, signed before the work begins. These terms cover your use of this website only. Where a signed agreement and these terms conflict, the signed agreement controls.",
    },
    warranty: {
      heading: "No Warranty",
      body: 'This site and its content are provided "as is," without warranty of any kind. Case study outcomes and metrics reflect the author\'s own account of the work and are not independently audited.',
    },
    governingLaw: {
      heading: "Governing Law",
      body: (state: string) =>
        `These terms are governed by the laws of the State of ${state}, United States, without regard to its conflict-of-laws rules, and any dispute arising from your use of this site will be brought in the state or federal courts located there. If any provision of these terms is found unenforceable, the remaining provisions stay in effect.`,
      separateAgreement:
        "This applies to the website. A signed consulting agreement carries its own governing-law and dispute-resolution terms, and those control for that work.",
    },
    contact: {
      heading: "Contact",
      prefix: "Questions about these terms can be sent via the ",
      linkLabel: "contact form",
      suffix: ".",
    },
  },

  resume: {
    metaTitle: "Resume",
    metaDescription: "Professional summary, experience, skills, and selected projects.",
    title: "Resume",
    subtitle: "Senior Full-Stack Software Engineer · Technical Lead · Engineering Leader",

    summaryHeading: "Professional Summary",
    summary:
      "Senior full-stack software engineer and technical lead with 10+ years of experience delivering enterprise platforms across financial services and HR technology. Built and operated customer-facing applications, improved API performance for high-traffic services, modernized legacy platforms, and designed cloud-native microservices that support business-critical workflows. Brings strong frontend, backend, AWS, API, and cross-functional leadership experience across Agile delivery teams. Currently open to new opportunities.",

    experienceHeading: "Experience",
    roles: {
      adp: {
        title: "Lead Application Developer, ADP",
        period: "Feb 2020 – Jul 2026",
        bullets: [
          "Built and maintained the customer-facing ADP community platform supporting collaboration features across chat, feed, surveys, broadcasts, analytics, and administrative experiences.",
          "Designed, developed, and launched a new NestJS microservice for customer-facing capabilities from architecture through production deployment, making technical decisions around package selection, service structure, and implementation strategy.",
          "Led AWS service setup and configuration for the new platform, including CloudFormation, ECS service wiring, and authentication/authorization endpoint registration.",
          "Modernized a legacy Express.js service, upgraded dependencies, and improved maintainability, security, and runtime efficiency.",
          "Improved API performance for a high-traffic microservice from approximately 500 TPS and a 2.5 second response time to approximately 1,350 TPS and a 100 millisecond response time through caching and data retrieval reduction.",
          "Migrated media storage from Amazon EFS to Amazon S3 to support multi-region deployment and disaster recovery for a high-traffic service.",
          "Modernized Angular administrative modules into Stencil.js micro-frontends, enabling incremental platform modernization and reducing maintenance overhead.",
          "Delivered new Angular-based customer-facing product capabilities for Surveys and Broadcasts, including multilingual survey support, analytics enhancements, and configurable survey experiences.",
          "Supported approximately 2 million API requests per day across customer-facing collaboration features.",
          "Partnered with Product, UX, QA, and engineering teams to translate requirements into production-ready delivery while contributing architecture reviews, sprint planning, and Agile execution across a 4–8 engineer team.",
          "Mentored engineers, onboarded new team members, and drove quality with Jest unit and integration coverage.",
        ],
      },
      fiservManager: {
        title: "Team Lead / Manager, Fiserv",
        period: "Jan 2019 – Feb 2020",
        bullets: [
          "Led a cross-functional engineering team supporting enterprise fraud alert platforms for financial institutions.",
          "Managed delivery risks, production support, and cross-team coordination to keep roadmap commitments on track.",
          "Worked with Product Owners and stakeholders to prioritize customer-driven enhancements and migration work.",
          "Supported modernization efforts that moved clients from legacy fraud alert capabilities to current platform workflows.",
        ],
      },
      fiservUiLead: {
        title: "UI Team Lead, Fiserv",
        period: "Jan 2018 – Dec 2018",
        bullets: [
          "Led distributed engineering teams across onshore and offshore resources delivering AngularJS and Angular applications across 4–5 product lines for approximately 100 enterprise customers.",
          "Delivered Angular-based UI products and customer-facing experiences across clients ranging from smaller agencies to enterprise accounts with millions of accounts.",
          "Demonstrated new UI capabilities through webinars and customer-facing sessions to support adoption and usage.",
          "Partnered with Product and Business Analysts to translate customer feedback into product enhancements and release priorities.",
          "Mentored developers and established delivery standards for a distributed engineering organization.",
        ],
      },
      fiservAngular: {
        title: "AngularJS Developer, Fiserv",
        period: "Jun 2017 – Dec 2018",
        bullets: [
          "Developed a reusable AngularJS application framework enabling rapid delivery of configurable enterprise web applications.",
          "Built and maintained Jenkins CI/CD pipelines supporting application deployments.",
          "Planned and executed CAT, UAT, and production releases.",
        ],
      },
      freelance: {
        title: "Freelance Full-Stack Web Developer",
        period: "2016 – 2017",
        bullets: [
          "Designed and developed custom websites and web applications for multiple clients.",
          "Built responsive frontend applications and supporting backend services using HTML5, CSS3, JavaScript, PHP, and MySQL.",
          "Implemented CMS and eCommerce solutions using WordPress.",
          "Gathered client requirements and translated business objectives into technical solutions.",
          "Maintained existing applications while ensuring quality, performance, and reliability.",
        ],
      },
      accenture: {
        title: "Informatica Developer, Accenture",
        period: "2014 – 2016",
        bullets: [
          "Developed internal web applications simplifying enterprise data access for engineering teams.",
          "Created complex Informatica mappings implementing business logic for enterprise data integration.",
          "Developed PL/SQL procedures and one-time remediation scripts supporting production systems.",
          "Optimized ETL workflows while troubleshooting production data issues and transformation logic.",
        ],
      },
    },

    skillsHeading: "Technical Skills",
    skillGroups: {
      frontend: "Frontend",
      backend: "Backend",
      cloud: "Cloud & Infrastructure",
      dataTesting: "Data & Testing",
      delivery: "Delivery & Leadership",
    },

    selectedProjectsHeading: "Selected Projects",

    educationHeading: "Education",
    education: {
      masters: {
        degree: "Master of Science — Computer Information Systems (In Progress)",
        detail: "Boston University · Concentration: Web Development",
      },
      bachelors: {
        degree: "Bachelor of Arts — Software and Information Systems (Cum Laude)",
        detail: "University of North Carolina at Charlotte · Minor: Mathematics",
      },
    },

    contactHeading: "Contact",
    startConversation: "Start a conversation",
  },

  footer: {
    profilesAriaLabel: "Profiles",
    navAriaLabel: "Footer",
    resume: "Resume",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    copyright: (year: number) => `© ${year} Rickie Cruz. All rights reserved.`,
  },
}

// The structural contract for every non-default locale.
export type Dictionary = typeof en
