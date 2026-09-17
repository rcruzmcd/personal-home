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
      coven: "Coven",
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
      "Currently: rebuilding after a layoff, solving my own financial challenges with code, and helping Chatter Snow scale their operations as Board Member + Director of Technology and Media.",
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
      body: "I'm Rickie — a software engineer with 12+ years of experience across consulting, financial services, HR technology, and engineering leadership. I got my start building data integrations at Accenture, grew from developer into a team lead and manager at First Data and Fiserv, and most recently led application development at ADP.",
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
        "I got comfortable with ownership early. As a UI team lead at First Data and Fiserv, I led distributed engineering teams across onshore and offshore resources, delivering products to roughly 100 enterprise customers. Coordinating across time zones and teams taught me to communicate clearly, flag problems before they become fires, and make decisions without waiting for permission.",
      durability:
        "I care about building things that outlast the person who built them — writing code with the next person in mind, being upfront about tradeoffs instead of overselling a quick fix, and treating maintainability as part of the job, not an afterthought.",
    },

    experience: {
      heading: "Experience",
      body: "I started at Accenture building Informatica/ETL data integrations, then freelanced as a full-stack web developer before joining First Data as an AngularJS developer. I grew into a UI team lead role leading distributed onshore/offshore teams, then into a team lead/manager role running a cross-functional engineering team on Fiserv's fraud alert platform. From there I moved to ADP as a lead application developer, focused on hands-on development, from 2022 until July 2026.",
      // Split around the inline link so the sentence can be reordered per
      // language rather than concatenated from fixed fragments.
      resumeLinkPrefix: "For the full breakdown, see my ",
      resumeLinkLabel: "resume",
      resumeLinkSuffix: ".",
    },

    currently: {
      heading: "Currently",
      body: "I'm looking for what's next, whether that's a full-time role or consulting work with a team that needs it. In the meantime, I'm building out this site and doing early work on a personal finance app I've wanted to build for years. I'm also a Board Member and Director of Technology and Media at Chatter, an LGBTQ+ ski and snowboard community organizing toward nonprofit status, where I lead the technical side of things.",
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
      "Technology shouldn't be a source of confusion. I help small organizations and nonprofits figure out what you actually need—without unnecessary complexity or corporate overhead. I've done this work (Board Member + Director of Technology and Media at Chatter Snow), and I understand your constraints.",

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

  // The Coven product marketing section. Module ids, ordering and which modules
  // each audience path shows live in @/lib/coven; only the words are here.
  coven: {
    name: "Coven",
    navAriaLabel: "Coven sections",
    nav: {
      overview: "Overview",
      nonprofits: "For nonprofits",
      business: "For business",
      modules: "Modules",
      pricing: "Pricing",
      security: "Security & data",
      faq: "Docs & FAQ",
    },
    // The section's one conversion, repeated on every page.
    demo: {
      cta: "Try the demo",
      newTabHint: "(opens in a new tab)",
      note: "No signup. Fictional data, rebuilt from scratch every night.",
    },
    screenshotPending: "Screenshot",
    breadcrumbCoven: "Coven",

    overview: {
      metaTitle: "Coven",
      metaDescription:
        "Coven replaces the spreadsheet, the shared drive, the donation form and the booking tool with one system. Built for small nonprofits and small businesses.",
      title: "Coven",
      tagline: "One system for small organizations that outgrew spreadsheets.",
      intro:
        "Most small organizations run on a pile: a spreadsheet for the money, a Drive folder for the documents, a form for donations or bookings, a separate tool for scheduling, and a website only one person can change. Coven is those things as one system, where the same record shows up everywhere it matters.",
      audienceNote:
        "Built for small nonprofits and small businesses. One product in your own vocabulary — not a separate edition for each.",
      seeModules: "See the modules",

      proof: {
        modules: { label: "Modules", value: "8" },
        signup: { label: "Signup to look around", value: "None" },
        reset: { label: "Demo data", value: "Reset nightly" },
      },

      replaces: {
        heading: "What it replaces",
        todayLabel: "Today",
        covenLabel: "With Coven",
        rows: [
          {
            today: "A spreadsheet only one person fully understands",
            withCoven:
              "Money, budgets and reimbursements in one ledger the whole team can read",
          },
          {
            today: "A Drive folder called Docs (new) FINAL",
            withCoven:
              "Documents attached to the thing they are about — a meeting, a grant, an event",
          },
          {
            today: "A donation or checkout form that emails you",
            withCoven:
              "Payments that land on a person's record and in the books at the same time",
          },
          {
            today: "A booking tool that has never heard of your members",
            withCoven: "Events, sessions and signups against the same list of people",
          },
          {
            today: "A website you have to ask someone to edit",
            withCoven: "A public site your own team edits, on your own domain",
          },
        ],
        footnote:
          "The combination is the point. Plenty of tools do one row well; what you are paying for is the seams between them.",
      },

      strip: {
        heading: "What it looks like",
        shots: [
          "The screen a small organization lands on: money in, money out, and what needs a decision this week.",
          "An event with its signups, its volunteers and its costs on one page.",
          "A person's record — membership, giving or purchase history, waivers, and the events they showed up to.",
        ],
      },

      doors: {
        heading: "Two front doors",
        body:
          "The product is the same. The words on the screen are not: every organization sets its own, so one reads donors where another reads customers.",
        nonprofits: {
          title: "For nonprofits",
          body:
            "Donations, grants, volunteers and programs — plus board governance, which no donor CRM does.",
          cta: "See the nonprofit path",
        },
        business: {
          title: "For small business",
          body:
            "Revenue, invoices, bookings, stock and staff scheduling in one place instead of four subscriptions.",
          cta: "See the business path",
        },
      },

      who: {
        heading: "Who is behind it",
        body:
          "Coven is built and run by Rickie Cruz, who has sat on a nonprofit board and run its digital operations. It grew out of the infrastructure built for Chatter Snow, a community organization that is now its first customer.",
        email: "hello@rickiecruz.com",
        emailIntro: "Monitored, and answered by a person:",
        aboutCta: "About Rickie",
        contactCta: "Start a conversation",
      },

      closing: {
        heading: "See it before you talk to anyone",
        body:
          "The demo is an ordinary organization on a demo plan, seeded with fictional data and rebuilt from scratch every night. Nothing you click can break anything, and nothing real is in it.",
      },
    },

    nonprofits: {
      metaTitle: "Coven for nonprofits",
      metaDescription:
        "Donations, grants, volunteers, programs, events and board governance in one system, built for small nonprofits.",
      title: "Coven for nonprofits",
      intro:
        "You are running a 501(c)(3) — or working toward one — on a donation form, a spreadsheet, and the goodwill of two volunteers. Coven is one place for the money, the people, the programs and the board.",
      leadHeading: "Governance is the part nobody else builds",
      leadBody:
        "Board roster and terms, meeting agendas, minutes, and resolutions recorded against the meeting that passed them. Donor CRMs stop at the donor and accounting software stops at the ledger. A small nonprofit's hardest month is the one where it has to prove what it decided and when.",
      modulesHeading: "What you get",
      modules: {
        governance: {
          title: "Board & governance",
          body:
            "Board roster with seats and terms, meeting agendas, minutes, and resolutions recorded against the meeting that passed them — the record your auditor, your state filing and your next board chair all ask for.",
          caption: "A board meeting with its agenda, attendance and recorded resolutions.",
        },
        finance: {
          title: "Donations, grants & reimbursements",
          body:
            "Donations with acknowledgements, restricted and unrestricted funds, grant reporting periods, and volunteer reimbursements that go through an approval instead of a payment app. Moving money between your own accounts is never counted as spending.",
          caption:
            "A month of donations, grants and reimbursements with restricted funds kept separate.",
        },
        people: {
          title: "Members, donors & participants",
          body:
            "One record per person: membership status, giving history, waivers, the programs they joined and the events they attended. No second list to keep in sync.",
          caption: "A person's record with membership, giving history and event attendance.",
        },
        volunteers: {
          title: "Volunteers & shifts",
          body:
            "Roles, shifts, signups and hours. Hours roll up into the totals grant applications ask for, without anyone rebuilding the spreadsheet in March.",
          caption: "A shift schedule with signups and logged volunteer hours.",
        },
        programs: {
          title: "Programs & sessions",
          body:
            "Programs, their sessions, who ran them and who showed up — the numbers your annual report needs, collected as the year happens rather than reconstructed after it.",
          caption: "A program with its sessions, leaders and attendance.",
        },
        events: {
          title: "Fundraisers & community events",
          body:
            "Ticketed or free signup, capacity, volunteers assigned, and what the event actually cost against what it raised.",
          caption:
            "A fundraiser with its signups, assigned volunteers, and cost against what it raised.",
        },
        inventory: {
          title: "Gear & donated goods",
          body:
            "What you own, what was donated, who has it and when it is due back. Gear libraries are where small organizations quietly lose the most money.",
          caption: "A gear library showing what is checked out and to whom.",
        },
        content: {
          title: "Public site & community calendar",
          body:
            "Your public website and the calendar your community actually reads, edited by your own team on your own domain — the same events, not a second copy of them.",
          caption: "The public site and community calendar an organization publishes on its own domain.",
        },
      },
      why: {
        heading: "Why not a donor CRM",
        body: [
          "A donor CRM is excellent at donors and blind to everything else — your gear, your volunteer hours, your board minutes, your public calendar. You end up with the CRM plus four other subscriptions and a spreadsheet holding them together.",
          "Coven's bet is the opposite one: the combination is the product. No donor CRM does board governance and gear inventory, because neither is a big enough market on its own. For a thirty-person organization they are the same job.",
        ],
      },
    },

    business: {
      metaTitle: "Coven for small business",
      metaDescription:
        "Revenue, invoices, expenses, bookings, stock and staff scheduling in one system, built for small businesses.",
      title: "Coven for small business",
      intro:
        "A studio, a shop, a small service business. You are paying for a booking tool, an invoicing tool, a spreadsheet for stock, a scheduling app and a website you cannot edit — and none of them have heard of each other. Coven is one system where a booking, a payment, a staff shift and a stock item are the same data.",
      leadHeading: "The seams are what cost you",
      leadBody:
        "Every tool in the stack is fine on its own. The cost is in the gaps: a customer who exists in three systems under three spellings, stock only the spreadsheet knows about, and a month-end you reconcile by hand because nothing agrees.",
      modulesHeading: "What you get",
      modules: {
        finance: {
          title: "Revenue, invoices & expenses",
          body:
            "Invoices, payments, recurring revenue and expenses in one ledger, with receipts attached to the line they belong to. Moving money between your own accounts is never counted as spending.",
          caption: "A month of revenue and expenses with invoices and attached receipts.",
        },
        events: {
          title: "Classes, bookings & workshops",
          body:
            "Sessions with capacity, bookings, waitlists and cancellations, and what each one earned against what it cost to run.",
          caption: "A class schedule with its bookings, capacity and waitlist.",
        },
        people: {
          title: "Customers & contacts",
          body:
            "One record per customer: purchase and booking history, waivers, notes, and the classes they actually attended. No second list to keep in sync.",
          caption: "A customer record with booking history and signed waivers.",
        },
        programs: {
          title: "Services & offerings",
          body:
            "What you sell, what it costs to deliver, and who delivered it — so you can see which offering is carrying the others.",
          caption: "A service offering with its sessions, staff and delivery cost.",
        },
        inventory: {
          title: "Stock & equipment",
          body:
            "Stock levels, equipment, rentals and returns, with what is out and who has it. Equipment that leaves the building is where the margin quietly goes.",
          caption: "Stock and equipment showing what is checked out and to whom.",
        },
        volunteers: {
          title: "Staff scheduling",
          body:
            "Shifts, roles, coverage and hours, on the same calendar as the classes and bookings they staff.",
          caption: "A staff schedule with shifts, roles and coverage.",
        },
        content: {
          title: "Public site & calendar",
          body:
            "Your website and your bookable calendar, edited by your own team on your own domain — the same sessions customers book, not a second copy of them.",
          caption: "The public site and bookable calendar a business publishes on its own domain.",
        },
      },
      why: {
        heading: "About the demo",
        body: [
          "The public demo is seeded as a nonprofit, so you will see donation and volunteer screens. It is the same product with different words: every label above is a per-organization setting, not a separate edition.",
          "A business demo is coming. Until it lands, the fastest honest answer to would this fit us is a short call where the screens get renamed live.",
        ],
        cta: "Ask for a walkthrough",
      },
    },

    modules: {
      metaTitle: "Modules",
      metaDescription:
        "Finance, people, volunteers, programs, events, inventory, governance and a public site — the modules that ship in Coven today.",
      title: "Modules",
      itemsHeading: "What ships today",
      intro:
        "Everything below ships today and is in the demo. Every plan includes every module: the combination is the product, so selling it in pieces would sell the wrong thing.",
      items: {
        finance: {
          title: "Finance",
          body:
            "Income and expenses in one ledger, with budgets, reimbursements or invoices, and receipts attached to the line they belong to. Moving money between your own accounts is never counted as spending.",
          caption: "A month of income and expenses with budgets and attached receipts.",
        },
        people: {
          title: "People",
          body:
            "One record per person — member, donor, customer or participant — carrying their history, their documents and everything they signed up for.",
          caption: "A person's record with history, documents and signups.",
        },
        volunteers: {
          title: "Volunteers & scheduling",
          body:
            "Roles, shifts, signups, coverage and logged hours, on the same calendar as the things being staffed.",
          caption: "A shift schedule with signups, coverage and logged hours.",
        },
        programs: {
          title: "Programs",
          body:
            "Recurring offerings and their sessions: who ran them, who attended, and what they cost to deliver.",
          caption: "A program with its sessions, leaders and attendance.",
        },
        events: {
          title: "Events",
          body:
            "One-off events with capacity, signups, waitlists and cancellations, and what each raised or earned against what it cost.",
          caption: "An event with its signups, capacity and running costs.",
        },
        inventory: {
          title: "Inventory",
          body:
            "What the organization owns, what is checked out, to whom, and when it is due back.",
          caption: "An inventory list showing what is checked out and to whom.",
        },
        governance: {
          title: "Governance",
          body:
            "Board roster and terms, meetings, agendas, minutes, and resolutions recorded against the meeting that passed them. Used by nonprofits, and simply left off for businesses.",
          caption: "A board meeting with its agenda, attendance and recorded resolutions.",
        },
        content: {
          title: "Public site & content calendar",
          body:
            "A public website and calendar for each organization, on its own domain, edited by the people who actually run it. Your brand tokens set how it looks — and generate a live brand guide at your own /brand, from the same tokens the product renders with, so the reference your volunteers and designers work from is never out of date and nobody maintains it by hand.",
          caption: "A public site and community calendar on an organization's own domain.",
        },
      },
      lexicon: {
        heading: "The same product, in your words",
        body:
          "There is no nonprofit edition and no business edition. Every label — donor or customer, program or service, volunteer or staff — is a per-organization setting, alongside your own roles, branding and public copy. That is what makes one product, two audiences an honest claim rather than a marketing one.",
      },
    },

    pricing: {
      metaTitle: "Pricing",
      metaDescription:
        "Coven pricing: plans sized by organization, every module included, real numbers and no contact-sales gate.",
      title: "Pricing",
      intro:
        "Plans are sized by how big your organization is, not by which features you are allowed to have. The same plans apply to nonprofits and to businesses.",
      draftNote:
        "Draft pricing. These numbers are a starting point and have not been finalized — confirm before quoting them anywhere.",
      everyPlanHeading: "In every plan",
      everyPlan: [
        "Every module — finance, people, volunteers, programs, events, inventory, governance and your public site",
        "Your own domain, carrying both the public site and your team's portal",
        "Unlimited people, donor, customer and transaction records",
        "A full export of your data, any time, without asking",
        "Support from the person who built it",
      ],
      perMonth: "/month",
      plans: {
        small: {
          name: "Small",
          price: "$39",
          annual: "or $390 a year",
          fit: "All-volunteer, or under five people running it",
          includes: ["Up to 5 staff accounts", "Nightly backups", "Email support"],
        },
        growing: {
          name: "Growing",
          price: "$89",
          annual: "or $890 a year",
          fit: "Five to twenty people running it, or one very busy season",
          includes: [
            "Up to 20 staff accounts",
            "Nightly backups with point-in-time restore",
            "Email support, next business day",
          ],
        },
        established: {
          name: "Established",
          price: "$179",
          annual: "or $1,790 a year",
          fit: "Twenty or more staff, several programs, or more than one location",
          includes: [
            "Unlimited staff accounts",
            "Nightly backups with point-in-time restore",
            "Priority support and a quarterly review",
          ],
        },
      },
      onboarding: {
        heading: "Onboarding",
        price: "$750 one time",
        body:
          "Your data out of the spreadsheets and into Coven, your vocabulary and roles set up, your domain connected, and two training sessions for the people who will use it daily. It is not required — you can set it up yourself — but most organizations want it.",
        nonprofit:
          "Nonprofits with an annual budget under $250,000 pay $375, and I keep limited pro bono capacity each quarter. Ask.",
      },
      notes: [
        "No contract, no minimum term, no per-record fees, and no charge for the people who only ever see your public site.",
        "Cancel whenever you like and take a full export with you.",
      ],
      faqCta: "What happens if you leave",
    },

    security: {
      metaTitle: "Security & data",
      metaDescription:
        "How Coven isolates each organization's data: row-level security in Postgres, permissions you control, an audit trail, and export and deletion on request.",
      title: "Security & data",
      intro:
        "Boards and owners ask this before anything else, so here is the actual answer rather than a badge.",
      items: [
        {
          title: "Isolation is enforced by the database, not by careful code",
          body:
            "Every table carries the organization a row belongs to, every row-level security policy is scoped to the current organization, and every foreign key between two of those tables is composite. Postgres itself rejects a cross-organization read or reference, including from a connection holding the service role. An application bug cannot leak another organization's data, because the query never returns it.",
        },
        {
          title: "There is no super-admin account",
          body:
            "No platform-wide role can see across organizations. When support needs access, your organization issues a time-boxed support membership and revokes it afterwards. Nobody holds standing access to your data.",
        },
        {
          title: "Permissions are yours to set",
          body:
            "Roles, and what each role can do, are per-organization settings rather than fixed tiers. A treasurer sees the ledger, a shift lead sees the schedule, a board member sees the minutes — you decide, and you change it without filing a ticket.",
        },
        {
          title: "An audit trail on the records that matter",
          body:
            "Who changed a financial record, a membership, a role or a resolution, and when. The questions that actually come up are about money and access, so those are what is logged.",
        },
        {
          title: "Export and deletion on request",
          body:
            "A full export of your organization's data is a feature, not a support request — it was built before the second organization was onboarded. Deletion on request is honored, and data-retention rules you set decide how long anything else is kept.",
        },
        {
          title: "Your public site is the only public part",
          body:
            "Everything in the portal sits behind authentication and is scoped to your organization. What the world sees is the site and the calendar you chose to publish.",
        },
      ],
      hosting: {
        heading: "Where it runs",
        body:
          "The application runs on Vercel, the database is managed Postgres on Supabase, DNS and CDN go through Cloudflare, and transactional email is sent through Resend. Primary infrastructure is in United States regions, and backups run nightly.",
      },
      ask: {
        heading: "Questions your board needs in writing",
        body:
          "Ask, and you will get a written answer rather than a sales call. Security questionnaires are fine too.",
        cta: "Ask a security question",
      },
    },

    faq: {
      metaTitle: "Docs & FAQ",
      metaDescription:
        "Getting your data into Coven, who owns it, what happens if you leave, and how setup actually goes.",
      title: "Docs & FAQ",
      intro: "The questions that come up before anyone signs anything.",
      items: [
        {
          question: "How do we get our data in?",
          answer:
            "Spreadsheets and CSV exports from whatever you use now: people, donations or invoices, and historical transactions. Onboarding includes the import. If you would rather do it yourself, the importer is in the product and it shows you what it matched before anything is written.",
        },
        {
          question: "Who owns the data?",
          answer:
            "You do. Your organization's records are yours. Nothing in them is sold, shared, or used to train anything.",
        },
        {
          question: "What happens if we leave?",
          answer:
            "You export everything, and the export is complete — the whole organization's data in open formats. Export already exists in the product; it is not a promise waiting to be built. After you leave, deletion is on request, and the retention rules you set decide the rest.",
        },
        {
          question: "Can we use our own domain?",
          answer:
            "Yes, on every plan. Your public site and your team's portal both run on your domain. Connecting it is part of onboarding and is a settings change, not a rebuild.",
        },
        {
          question: "Does it replace our accounting software?",
          answer:
            "No, and it does not try to. Coven is where the operational money lives: donations, invoices, reimbursements, what an event cost. Your bookkeeper still files the return, and the export is what you hand them.",
        },
        {
          question: "Do our members and customers need accounts?",
          answer:
            "Only the people who run the organization need accounts, and those are what a plan is sized on. Everyone else signs up for an event, makes a donation or books a class without one.",
        },
        {
          question: "How long does setup take?",
          answer:
            "A small organization is usually running in a week or two, and most of that is deciding your vocabulary and your roles rather than technical work. You can see the whole product today without talking to anyone.",
        },
        {
          question: "Is it finished, or are we a beta test?",
          answer:
            "It runs a real organization's operations today, and did so before it was a product. It is young, and you would be an early customer — which means direct access to the person building it, and real influence over what comes next.",
        },
      ],
    },
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
      "Senior full-stack software engineer and technical lead with 12+ years of experience delivering enterprise platforms across financial services and HR technology. Built and operated customer-facing applications, improved API performance for high-traffic services, modernized legacy platforms, and designed cloud-native microservices that support business-critical workflows. Brings strong frontend, backend, AWS, API, and cross-functional leadership experience across Agile delivery teams. Currently open to new opportunities.",

    experienceHeading: "Experience",
    roles: {
      adp: {
        title: "Lead Application Developer, ADP",
        period: "Feb 2022 – Jul 2026",
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
        period: "Jun 2020 – Feb 2022",
        bullets: [
          "Led a cross-functional engineering team supporting enterprise fraud alert platforms for financial institutions.",
          "Managed delivery risks, production support, and cross-team coordination to keep roadmap commitments on track.",
          "Worked with Product Owners and stakeholders to prioritize customer-driven enhancements and migration work.",
          "Supported modernization efforts that moved clients from legacy fraud alert capabilities to current platform workflows.",
        ],
      },
      fiservUiLead: {
        title: "UI Team Lead, First Data → Fiserv",
        period: "Mar 2019 – Jun 2020",
        bullets: [
          "Led distributed engineering teams across onshore and offshore resources delivering AngularJS and Angular applications across 4–5 product lines for approximately 100 enterprise customers.",
          "Delivered Angular-based UI products and customer-facing experiences across clients ranging from smaller agencies to enterprise accounts with millions of accounts.",
          "Demonstrated new UI capabilities through webinars and customer-facing sessions to support adoption and usage.",
          "Partnered with Product and Business Analysts to translate customer feedback into product enhancements and release priorities.",
          "Mentored developers and established delivery standards for a distributed engineering organization.",
          "Carried the role through Fiserv's 2019 acquisition of First Data, continuing delivery across the combined organization's product lines.",
        ],
      },
      fiservAngular: {
        title: "AngularJS Developer, First Data",
        period: "Jan 2017 – Mar 2019",
        bullets: [
          "Developed a reusable AngularJS application framework enabling rapid delivery of configurable enterprise web applications.",
          "Built and maintained Jenkins CI/CD pipelines supporting application deployments.",
          "Planned and executed CAT, UAT, and production releases.",
        ],
      },
      freelance: {
        title: "Freelance Full-Stack Web Developer",
        period: "Jan 2016 – Dec 2018",
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
        period: "Aug 2014 – Feb 2016",
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
