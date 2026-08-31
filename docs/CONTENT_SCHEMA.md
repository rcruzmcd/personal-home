# Content Schema & Data Models

## Project Content Schema

**For both Work (case studies) and Personal Projects**

```typescript
interface Project {
  // Metadata
  id: string;                    // Unique identifier: "chatter-snow"
  title: string;                 // "Chatter Snow"
  slug: string;                  // "chatter-snow"
  description: string;           // 1-2 sentence overview
  featured: boolean;             // Show on homepage?
  
  // Classification
  category: string;              // "work" or "project"
  subcategory?: string;          // "platform", "dashboard", "tool", etc.
  status: "active" | "experiment" | "completed" | "archived";
  
  // Dates
  startDate: string;             // YYYY-MM-DD
  endDate?: string;              // YYYY-MM-DD (if completed)
  publishedDate: string;         // When published to site
  
  // Work projects only
  role?: string;                 // "Founder", "Director", "Lead Engineer"
  organization?: string;         // "Chatter Snow"
  relationship?: string;         // "Board + Director of Tech Ops" (explain if not a client)
  
  // Technology
  technologies: string[];        // ["Next.js", "TypeScript", "Supabase"]
  
  // Visual content
  heroImage?: string;            // Path to hero image
  images: string[];              // Array of image paths for gallery
  videoUrl?: string;             // Embedded video (if applicable)
  
  // Links
  links: Array<{
    title: string;
    url: string;
    type: "live" | "github" | "demo" | "blog";
  }>;
  
  // Case study content (for work projects)
  casestudy?: {
    problem: string;             // What problem did you solve?
    context: string;             // Background
    goals: string[];             // What were you trying to accomplish?
    constraints: string[];       // Timeline, budget, team, etc.
    research?: string;           // How did you understand the problem?
    architecture?: string;       // How did you structure the solution?
    design?: string;             // Approach to UI/UX
    implementation?: string;     // How you built it
    challenges: string[];        // What was hard?
    decisions: Array<{
      title: string;
      description: string;
      tradeoffs: string;
    }>;
    result: string;              // Outcome
    lessonLearned: string[];     // Key takeaways
    metrics?: {
      metric: string;
      value: string;
    }[];
  };
  
  // Personal project details
  personalProject?: {
    whatItDoes: string;          // What does it do?
    whyIBuiltIt: string;         // Why did you build it?
    technicalDecisions: string[]; // Interesting technical choices
  };
  
  // SEO
  seoTitle?: string;             // Custom meta title
  seoDescription?: string;       // Custom meta description
  
  // Structured
  content: string;               // Full markdown/MDX content
  tags?: string[];               // Additional tags for filtering
}
```

## Storage Structure

### File-based (Recommended for MVP)

```
content/
├── work/
│   ├── chatter-snow/
│   │   ├── index.mdx           # Content + metadata
│   │   └── images/
│   │       ├── hero.jpg
│   │       ├── screenshot-1.jpg
│   │       └── screenshot-2.jpg
│   └── another-project/
│       └── ...
│
└── projects/
    ├── personal-finance/
    │   ├── index.mdx
    │   └── images/
    │       ├── dashboard.jpg
    │       └── forecast.jpg
    └── other-project/
        └── ...
```

### Frontmatter Format (MDX)

```yaml
---
id: chatter-snow
title: "Chatter Snow"
slug: chatter-snow
description: "Built the digital infrastructure supporting a growing LGBTQ+ ski and snowboard nonprofit."
featured: true
category: work
status: active

startDate: "2025-01-15"
endDate: "2026-08-31"
publishedDate: "2026-09-01"

role: "Board Member + Director of Digital Operations"
organization: "Chatter Snow"
relationship: "Board Member and Director of Digital Operations"

technologies:
  - Next.js
  - TypeScript
  - Supabase
  - Zoho
  - Vercel
  - Cloudflare

heroImage: ./images/hero.jpg
images:
  - ./images/inventory.jpg
  - ./images/community-view.jpg
  - ./images/dashboard.jpg

links:
  - title: "Live Site"
    url: "https://chattersnow.org"
    type: live
  - title: "GitHub (Private)"
    url: "#"
    type: github

seoTitle: "Chatter Snow — Digital Operations Platform | Rickie Cruz"
seoDescription: "Case study: Built the technical infrastructure for Chatter Snow, an LGBTQ+ nonprofit, from inventory management to full operations platform."

---

# Chatter Snow

## Problem
[Problem description...]

## Solution
[Solution description...]

## Result
[Result description...]
```

### JSON Alternative (if using TypeScript)

```typescript
// data/projects.ts

export const projects = {
  work: [
    {
      id: "chatter-snow",
      title: "Chatter Snow",
      slug: "chatter-snow",
      description: "Built the digital infrastructure supporting a growing LGBTQ+ ski and snowboard nonprofit.",
      featured: true,
      category: "work",
      status: "active",
      startDate: "2025-01-15",
      endDate: "2026-08-31",
      publishedDate: "2026-09-01",
      role: "Board Member + Director of Digital Operations",
      organization: "Chatter Snow",
      technologies: ["Next.js", "TypeScript", "Supabase", "Zoho", "Vercel", "Cloudflare"],
      heroImage: "/images/chatter-snow/hero.jpg",
      images: [
        "/images/chatter-snow/inventory.jpg",
        "/images/chatter-snow/community-view.jpg",
        "/images/chatter-snow/dashboard.jpg",
      ],
      links: [
        { title: "Live Site", url: "https://chattersnow.org", type: "live" },
      ],
      casestudy: {
        problem: "Chatter Snow was growing but had no system to track inventory or communicate what equipment was available.",
        context: "Nonprofit with limited budget, volunteer team, growing community interest.",
        goals: [
          "Create centralized inventory system",
          "Enable community to see available gear",
          "Reduce manual admin work",
        ],
        constraints: [
          "Nonprofit budget",
          "Volunteer-driven",
          "Need to launch quickly",
        ],
        result: "Chatter now has centralized inventory, community can see available gear, admin overhead reduced.",
        lessonLearned: [
          "Start narrow, design wide",
          "Integrate don't replace existing tools",
          "Design for your actual users",
        ],
      },
      seoTitle: "Chatter Snow — Digital Operations Platform | Rickie Cruz",
      seoDescription: "Case study: Built technical infrastructure for LGBTQ+ nonprofit, from inventory management to full operations platform.",
    },
    // More work projects...
  ],
  projects: [
    // Personal projects...
  ],
};
```

---

## Component Data Props

### Project Card Component

```typescript
interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  category: "work" | "project";
  status: "active" | "experiment" | "completed" | "archived";
  technologies: string[];
  heroImage?: string;
  link: string;  // Link to detail page
}
```

### Case Study Page Component

```typescript
interface CaseStudyProps {
  project: Project;
}
```

---

## Content Management Workflow

### For MVP (Files in Git)

1. **Create project folder** under `content/work/` or `content/projects/`
2. **Write MDX file** with frontmatter
3. **Add images** to `images/` subfolder
4. **Commit and push** to GitHub
5. **Vercel deploys automatically**
6. **Visit live site**

### Creating New Content

```bash
# 1. Create folder
mkdir content/work/new-project
mkdir content/work/new-project/images

# 2. Create index.mdx with frontmatter

# 3. Add images to images/ folder

# 4. Reference images in markdown
![Project Screenshot](./images/screenshot.jpg)

# 5. Commit
git add content/work/new-project
git commit -m "Add new project: New Project"

# 6. Push
git push

# 7. Vercel deploys automatically
```

---

## Image Organization

### Naming Convention

```
images/
├── hero.jpg              # Hero/cover image (wide aspect ratio)
├── screenshot-1.jpg      # In order of appearance
├── screenshot-2.jpg
├── diagram-architecture.svg  # Diagrams
├── chart-results.png
└── mobile-view.jpg       # Different device view
```

### Image Specs

**Hero image:**
- Size: ~1200x600px
- Format: JPG (compressed)
- Purpose: Homepage preview, social preview

**Screenshots:**
- Size: ~1200x800px for desktop, ~600x1000px for mobile
- Format: JPG or PNG
- Optimized for web (compress)

**Diagrams:**
- Format: SVG preferred (scalable), PNG acceptable
- Size: 800-1200px wide

### Image Processing

Use Next.js `<Image>` component:

```tsx
import Image from 'next/image';

<Image
  src="/images/chatter-snow/hero.jpg"
  alt="Chatter Snow inventory dashboard"
  width={1200}
  height={600}
  priority  // For hero image (above fold)
/>
```

Benefits:
- Automatic optimization
- Format conversion (WebP, AVIF)
- Responsive images
- Lazy loading for below-fold

---

## Reading Content Programmatically

### With MDX

```typescript
// pages/work/[slug].tsx
import { getProjects } from '@/lib/projects';

export async function getStaticProps(context) {
  const { slug } = context.params;
  const projects = await getProjects();
  const project = projects.find(p => p.slug === slug);
  
  return {
    props: { project },
    revalidate: 3600, // Revalidate every hour
  };
}
```

### With JSON

```typescript
// lib/projects.ts
import projectsData from '@/data/projects.json';

export function getProjects() {
  return projectsData;
}

export function getProject(slug: string) {
  return projectsData.work.find(p => p.slug === slug);
}
```

---

## SEO Metadata

### Per-Project Metadata

```typescript
interface ProjectSEO {
  title: string;              // "Chatter Snow — Case Study | Rickie Cruz"
  description: string;        // Meta description
  image: string;              // OG image (hero image)
  canonical: string;          // https://rickiecruz.com/work/chatter-snow
  
  // Structured data
  structured?: {
    "@context": "https://schema.org";
    "@type": "CreativeWork" | "SoftwareApplication";
    name: string;
    description: string;
    image: string;
    url: string;
  };
}
```

### Generate in Component

```tsx
// components/ProjectHead.tsx
import Head from 'next/head';

export function ProjectHead({ project }: { project: Project }) {
  const url = `https://rickiecruz.com/work/${project.slug}`;
  const image = `https://rickiecruz.com/images/${project.slug}/${project.heroImage}`;
  
  return (
    <Head>
      <title>{project.seoTitle || `${project.title} | Rickie Cruz`}</title>
      <meta name="description" content={project.seoDescription || project.description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={project.title} />
      <meta property="og:description" content={project.description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={project.title} />
      <meta name="twitter:description" content={project.description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            image: image,
            url: url,
          }),
        }}
      />
    </Head>
  );
}
```

---

## Filtering & Sorting

### Filter Projects by Category

```typescript
export function getWorkProjects() {
  return projects.work.filter(p => p.category === 'work');
}

export function getPersonalProjects() {
  return projects.projects.filter(p => p.category === 'project');
}

export function getFeaturedProjects(limit = 3) {
  return projects.work
    .filter(p => p.featured)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}
```

### Filter by Technology

```typescript
export function getProjectsByTechnology(tech: string) {
  return projects.work.filter(p => 
    p.technologies.includes(tech)
  );
}
```

### Filter by Status

```typescript
export function getActiveProjects() {
  return projects.work.filter(p => p.status === 'active');
}
```

---

## Content Validation

### TypeScript Types (Ensure Data Integrity)

```typescript
// types/project.ts
import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  featured: z.boolean(),
  category: z.enum(['work', 'project']),
  status: z.enum(['active', 'experiment', 'completed', 'archived']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  technologies: z.array(z.string()).min(1),
  links: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.enum(['live', 'github', 'demo', 'blog']),
  })).optional(),
});

export type Project = z.infer<typeof ProjectSchema>;
```

---

## Future: CMS Integration

When you have enough content to justify it:

**Options:**
- Contentful (headless CMS)
- Sanity.io (headless CMS)
- Strapi (self-hosted CMS)
- Ghost (blog-focused)

**Not needed for MVP.** Git + markdown is simpler and actually good for version control.

---

## Backup Strategy

### Content Backup

1. **GitHub** — Primary version control
   - All content committed
   - History preserved
   - Public or private

2. **Local Machine**
   - Clone of repo
   - Regular pulls ensure you have latest

3. **External** (Optional)
   - Zip and upload to cloud storage monthly
   - Extra safety net

### Image Backup

1. **Git LFS** (if images are large)
   - Store large files in Git with LFS
   - Keeps repo size manageable

2. **Cloud Storage** (if images get large)
   - Upload to Cloudflare R2 or AWS S3
   - Reference by URL instead of storing in git
   - Reduces repo size

For MVP: Keep images in git (under 100MB total is fine).

---

## Content Checklist Before Publishing Project

- [ ] Project has unique, descriptive slug
- [ ] All required fields filled in (title, description, technologies)
- [ ] Hero image added and optimized
- [ ] Screenshots added (min 2, max 5)
- [ ] All image alt text written
- [ ] Links are correct and working
- [ ] SEO title and description written
- [ ] Case study content (if work project) complete
- [ ] No typos or grammar errors
- [ ] Links preview correctly (test og:title/description)
- [ ] Images look good (check sizes, aspect ratios)
- [ ] Technologies accurately listed
- [ ] Start date, end date, publish date filled in
- [ ] Featured flag set if applicable
- [ ] Committed to git and pushed

---

## Template: New Work Project

```yaml
---
id: my-project
title: "Project Title"
slug: my-project
description: "1-2 sentence description of what this project is."
featured: false
category: work
status: active

startDate: "2025-01-01"
endDate: "2025-03-31"
publishedDate: "2025-09-01"

role: "Your Role"
organization: "Client/Organization"

technologies:
  - Tech1
  - Tech2
  - Tech3

heroImage: ./images/hero.jpg
images:
  - ./images/screenshot-1.jpg
  - ./images/screenshot-2.jpg

links:
  - title: "Live Site"
    url: "https://example.com"
    type: live

seoTitle: "Project Title — Case Study | Rickie Cruz"
seoDescription: "Case study description for search engines."

---

# Project Title

## Problem

What problem did you solve?

## Solution

How did you solve it?

## Result

What's the outcome?

## Technologies

Why did you choose these technologies?
```

---

## Template: New Personal Project

```yaml
---
id: my-experiment
title: "Project Name"
slug: my-experiment
description: "What does this project do?"
featured: false
category: project
status: experiment

startDate: "2025-01-01"
publishedDate: "2025-09-01"

technologies:
  - Tech1
  - Tech2

heroImage: ./images/hero.jpg
images:
  - ./images/screenshot-1.jpg

links:
  - title: "Live Demo"
    url: "https://example.com"
    type: demo

seoTitle: "Project Name | Rickie Cruz"
seoDescription: "Short description of the project."

---

# Project Name

## What It Does

Description of functionality.

## Why I Built It

What problem or interest inspired this?

## Technical Decisions

What's interesting about how it's built?

## Status

Is it active, experimental, or archived?
```
