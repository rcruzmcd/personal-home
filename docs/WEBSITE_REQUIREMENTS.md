# Website Requirements

## Site Architecture

```
rickiecruz.com/
├── /                    (Homepage)
├── /about               (About page)
├── /work                (Work/Case Studies)
├── /work/[project]      (Individual case study)
├── /projects            (Personal projects)
├── /projects/[project]  (Individual project detail)
├── /consulting          (Consulting overview)
├── /resume              (Resume page + PDF download)
├── /contact             (Contact form)
└── /[legal pages]       (Privacy, Terms, etc.)
```

## Homepage

### Hero Section
- **Primary headline:** "Rickie Cruz"
- **Tagline:** "Software engineer building digital products, systems, and experiences."
- **Supporting copy:** "I design and build web applications, explore new interfaces, and help small organizations make sense of their technology."
- **CTAs:**
  - Primary: "View my work"
  - Secondary: "Let's talk"

### Featured Work Section
- Display 2-3 case studies (MVP: Chatter Snow + Personal Finance)
- Each project card includes:
  - Project name
  - Short description
  - Category
  - Role
  - Technologies (tags)
  - Visual preview/hero image
  - Link to case study

### Interactive Elements
- Smooth transitions
- Responsive layouts
- Dark/light mode toggle
- Micro-interactions (thoughtful, not excessive)
- Keyboard navigation
- Accessible focus states

## Case Study Template

Each case study should include:

1. **Overview** — What is this?
2. **Problem** — What problem did you solve?
3. **Context** — Background/constraints
4. **Goals** — What were you trying to accomplish?
5. **Constraints** — Timeline, budget, team, etc.
6. **Research/Discovery** — How did you understand the problem?
7. **Architecture** — How did you structure the solution?
8. **Design** — Approach to UI/UX
9. **Implementation** — How you built it
10. **Challenges** — What was hard?
11. **Decisions** — Key trade-offs and why
12. **Result** — What's the outcome?
13. **Lessons Learned** — What did you learn?

### Optional Case Study Elements
- Interactive architecture diagram
- Technology decisions and rationale
- Tradeoffs (what you didn't build and why)
- Before/after comparison
- Metrics/impact
- Screenshots/video

## About Page

- **Who I am** — Short personal introduction
- **What I do** — Software engineering / product / systems
- **How I work** — Your approach to solving problems
- **Experience** — Professional history
- **Currently** — What you're working on now
- **Outside of work** — Personal interests (skiing, fitness, projects, community involvement)

*Goal: Make it feel like a person, not a corporate consulting page*

## Projects Section

Separate from professional work. Each project shows:
- What it does
- Why you built it
- Screenshots/video
- Technology
- Interesting technical decisions
- Current status

### Project Statuses
- `Active` — Actively developed
- `Experiment` — Exploration/learning
- `Completed` — Shipped and done
- `Archived` — No longer maintained

### Project Categories (optional)
- Finance
- Fitness
- UI
- Data
- Life (other useful things)

## Consulting Section

### Positioning (subtle, not aggressive)
> Technology shouldn't be a source of confusion. I help small organizations understand their technology, improve their digital infrastructure, and build the tools they actually need.

### Services

**Technology Health Check**
- Review organization's technology ecosystem
- Deliverable: Technology assessment + prioritized roadmap
- Includes: website, hosting, DNS, email, SaaS, security, access, analytics, payments, storage, backups, costs
- Starting at: $150-350 (nonprofit), $350-500 (small business)

**Website & Web Applications**
- Modern websites and custom web applications
- For organizations that outgrew templates
- Starting at: $1,500

**Technical Strategy**
- Help organizations answer: "What should we actually use?"
- Covers: technology selection, architecture, cloud infrastructure, integrations, data, authentication, automation
- Starting at: $100/hour

**Internal Tools**
- Build lightweight tools to replace spreadsheets, manual workflows, repetitive processes
- Custom pricing

### Nonprofit & Community Support
- Offer reduced-rate consulting to qualifying nonprofits and community organizations
- Limited pro bono capacity (1-2 projects per quarter)
- Free 30-minute conversation to start

**Free offerings:**
- 30-minute consultation
- OR 60-minute technology health check (max 3-5 recommendations)

**Paid offerings:**
- Anything involving detailed research, written audit, architecture, implementation, development, migration, vendor comparison, ongoing support

## Resume Page

### Content
- Current professional summary
- Experience
- Technical skills
- Selected projects
- Education
- Contact information

### Actions
- "View online" (web version)
- "Download PDF"

*Note: Resume is supporting, not primary. Don't make it the homepage.*

## Contact Page

### Simple Form
```
Name * [required]
Email * [required]
Organization [optional]
What can I help with? * [required]
Message * [required]
```

### Category Selector
- ○ Consulting
- ○ Website / application
- ○ Technical question
- ○ Collaboration
- ○ Employment
- ○ Other

### CTA
"Start a conversation"

## Email Setup

### Domain Email
- **Primary:** rickie@rickiecruz.com (professional)
- **Public:** hello@rickiecruz.com (public-facing contact)
- **Future:** projects@rickiecruz.com (project-specific)

All route appropriately without requiring separate inboxes initially.

## SEO Requirements

### Per-Page Elements
- Unique title tag
- Meta description
- Open Graph metadata
- Social preview image
- Canonical URL
- Structured data where appropriate

### Site-Wide
- `sitemap.xml`
- `robots.txt`
- Person schema (https://schema.org/Person)
- WebSite schema
- CreativeWork / SoftwareApplication schema for projects

## Analytics

### Track (not just page views)
- `project_view`
- `resume_download`
- `contact_started`
- `contact_submitted`
- `consulting_view`
- `external_project_click`
- `github_click`
- `linkedin_click`

### Privacy
- Use privacy-conscious analytics (no cookies if possible)
- Only collect what you actually need
- Transparent about what's tracked

## Security

### Minimum Requirements
- HTTPS (automatic with Vercel)
- Secure headers
- Spam protection on forms
- Input validation
- Rate limiting on contact endpoints
- No secrets in client-side code
- Environment variables for sensitive config
- Dependency monitoring
- Automated dependency updates

### No Database Unless Necessary
If you don't need one, don't build one. Contact form submissions can be handled server-side.

## Accessibility (Portfolio Requirement)

### Must Support
- Keyboard navigation (Tab, Enter, Esc, etc.)
- Screen readers (semantic HTML, ARIA where needed)
- Proper semantic HTML (`<button>` not `<div>` for buttons)
- Visible focus states
- `prefers-reduced-motion` support
- Sufficient color contrast (WCAG AA minimum)
- Accessible forms (labels, error messages)
- Meaningful alt text for images
- Correct heading hierarchy (h1 > h2 > h3)

### Testing
- WAVE or axe DevTools
- Keyboard-only navigation
- Screen reader testing (NVDA, JAWS, VoiceOver)

## Performance

### Lighthouse Targets
- Performance: 90+
- Accessibility: 95+
- SEO: 95+
- Best Practices: 95+

### Requirements
- Optimized and responsive images
- Minimal JavaScript where possible
- Server-rendered / static content where appropriate
- No unnecessary third-party scripts
- Fast initial page load
- Good Core Web Vitals (LCP, FID, CLS)

## Design Goals

**The website should itself be evidence of quality work.**

Landing on rickiecruz.com should make someone think: "Oh. This person knows what they're doing."

### Because of:
- Excellent typography
- Intentional spacing
- Thoughtful interactions
- Sensible information architecture
- Mobile is as polished as desktop
- Everything is fast
- Accessibility isn't an afterthought
- Case studies show actual engineering judgment

Not because of:
- Giant walls of technical buzzwords
- Flashy animations
- Clever design for its own sake
- Over-engineering simple layouts

## Legal/Privacy

- Privacy Policy
- Terms (if applicable)
- Cookie/analytics disclosure
- Contact information
- Copyright notice

### On Chatter Snow
Present as: "Chatter Snow — Board Technology Project"

Clearly identify your relationship (Board Member + Director of Digital Operations)

Don't represent as a client you consulted for.
