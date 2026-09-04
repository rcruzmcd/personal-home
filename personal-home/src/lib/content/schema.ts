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
  // Optional: only set once a published case study has been revised. Absent
  // means "never revised", so the page shows the published date alone rather
  // than an "Updated" line that just repeats it.
  updatedDate: isoDate.optional(),

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

// A Spanish entry is an *overlay* on the English one, not a second copy of it:
// `content/work/<slug>/index.es.mdx` carries only the fields whose value is
// language-dependent. Everything else — id, slug, dates, technologies, status,
// images, link URLs — stays in `index.mdx` alone, so those facts have exactly
// one home and cannot drift between locales.
//
// `.strict()` is the point of having a separate schema: a mistyped or
// no-longer-existent key in a translation file fails the build instead of being
// silently dropped, which is otherwise a very quiet way to lose a paragraph.
export const ProjectTranslationSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    subcategory: z.string().optional(),
    role: z.string().optional(),
    organization: z.string().optional(),
    relationship: z.string().optional(),
    // Only the human-readable label is translatable; url and type are
    // locale-invariant and are merged in from the English entry.
    links: z.array(z.object({ title: z.string().min(1) })).optional(),
    casestudy: CaseStudySchema.partial().optional(),
    personalProject: PersonalProjectSchema.partial().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
  .strict()

export type ProjectTranslation = z.infer<typeof ProjectTranslationSchema>
