// Locale-invariant resume structure. Technology names, dates and ordering are
// the same in every language, so they live here rather than being duplicated
// into each dictionary where they could drift apart. The prose that goes with
// them — role titles, bullets, section headings — is in the string catalog,
// keyed by the same ids.

export const RESUME_ROLES = [
  "adp",
  "fiservManager",
  "fiservUiLead",
  "fiservAngular",
  "freelance",
  "accenture",
] as const

export type ResumeRole = (typeof RESUME_ROLES)[number]

// Only the roles that display a technology row have an entry; the others
// deliberately show none, matching how the page read before.
export const ROLE_TECHNOLOGIES: Partial<Record<ResumeRole, readonly string[]>> = {
  adp: [
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
  ],
  fiservAngular: [
    "Angular",
    "AngularJS",
    "Java",
    "JavaScript",
    "Jenkins",
    "Git",
    "Agile",
    "Scrum",
  ],
}

export const SKILL_GROUPS = [
  "frontend",
  "backend",
  "cloud",
  "dataTesting",
  "delivery",
] as const

export type SkillGroup = (typeof SKILL_GROUPS)[number]

export const SKILL_ITEMS: Record<SkillGroup, readonly string[]> = {
  frontend: [
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
  backend: ["Node.js", "Express.js", "NestJS", "REST APIs", "Microservices", "API Design"],
  cloud: ["AWS ECS", "Amazon S3", "Amazon EFS", "CloudFormation", "Docker"],
  dataTesting: ["MongoDB", "Jest", "Unit Testing", "Integration Testing", "SQL"],
  delivery: [
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
}

export const EDUCATION = ["masters", "bachelors"] as const

export type EducationEntry = (typeof EDUCATION)[number]
