import { z } from "zod"

// Images live under public/images/<category>/<slug>/ (not co-located with the
// content file) because next/image needs a public URL, not a filesystem path
// a bundler can resolve. Frontmatter holds absolute "/images/..." paths.

const LinkSchema = z.object({
  title: z.string().min(1),
  // Not z.url() — some links are intentional placeholders (e.g. "#" for a
  // private repo) that aren't real URLs yet.
  url: z.string().min(1),
  type: z.enum(["live", "github", "demo", "blog"]),
})

const DecisionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  tradeoffs: z.string().min(1),
})

const MetricSchema = z.object({
  metric: z.string().min(1),
  value: z.string().min(1),
})

const CaseStudySchema = z.object({
  problem: z.string().min(1),
  context: z.string().min(1),
  goals: z.array(z.string()).min(1),
  constraints: z.array(z.string()).min(1),
  research: z.string().optional(),
  architecture: z.string().optional(),
  design: z.string().optional(),
  implementation: z.string().optional(),
  challenges: z.array(z.string()).min(1),
  decisions: z.array(DecisionSchema).default([]),
  result: z.string().min(1),
  lessonLearned: z.array(z.string()).min(1),
  metrics: z.array(MetricSchema).optional(),
})

const PersonalProjectSchema = z.object({
  whatItDoes: z.string().min(1),
  whyIBuiltIt: z.string().min(1),
  technicalDecisions: z.array(z.string()).default([]),
})

// docs/CONTENT_SCHEMA.md's example zod schema uses z.string().datetime()
// (requires a full ISO-8601 timestamp), but every real frontmatter example
// in that doc uses a date-only string ("2025-01-15"). z.iso.date() matches
// what's actually written — keep it this way, don't "fix" it back.
const isoDate = z.iso.date()

export const ProjectFrontmatterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  featured: z.boolean().default(false),

  category: z.enum(["work", "project"]),
  subcategory: z.string().optional(),
  status: z.enum(["active", "experiment", "completed", "archived"]),

  startDate: isoDate,
  endDate: isoDate.optional(),
  publishedDate: isoDate,

  role: z.string().optional(),
  organization: z.string().optional(),
  relationship: z.string().optional(),

  technologies: z.array(z.string()).min(1),

  heroImage: z.string().optional(),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().optional(),

  links: z.array(LinkSchema).default([]),

  casestudy: CaseStudySchema.optional(),
  personalProject: PersonalProjectSchema.optional(),

  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
})
