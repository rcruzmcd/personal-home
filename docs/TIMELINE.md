# Development Timeline — 4 Week Rollout

## Philosophy

Path B: Launch website quickly with Chatter Snow case study, then build Personal Finance without time pressure.

**Week 1:** Setup + Content gathering
**Week 2:** Build website MVP + Chatter Snow case study
**Week 3:** Continue website + Begin Personal Finance project
**Week 4:** Polish + Launch website, ongoing Personal Finance development

---

> **Status:** The website portion of this plan (roughly the Week 1–3 website
> tasks below) has shipped, built in a single implementation pass rather than
> across four calendar weeks — see `personal-home/` and the root `CLAUDE.md`.
> Checkboxes below are flipped where the task is verifiable from the repo;
> anything requiring an external account, a deploy, manual/device testing, or
> a real-world action (domain, DNS, social posts, hour tracking) is left
> unchecked since a repo can't confirm it — verify those separately.
> **Personal Finance OS exists as `finance-os/` but is only the default
> `create-next-app` scaffold** — same stack as the website (Next.js 16,
> React 19, TypeScript, Tailwind v4, bun), no finance features, Supabase, or
> shared design system wired up yet. Every other finance-related task below
> is still open (see `docs/PERSONAL_FINANCE_REQUIREMENTS.md`).

---

## Week 1: Setup + Content (Sept 1-7)

### Website Setup

**Tasks:**

- [x] Create Next.js repo: `rickiecruz.com` (1 hr)
  - TypeScript configuration
  - ESLint/Prettier setup
  - Basic folder structure — shipped as App Router (`src/app/`), not Pages Router

- [ ] Set up Vercel project (30 min) — not verifiable from the repo; confirm separately
  - Connect GitHub repo
  - Set environment variables
  - Configure domain rickiecruz.com

- [ ] Set up DNS with Cloudflare (1 hr) — not verifiable from the repo; confirm separately
  - Point rickiecruz.com to Vercel
  - Set up email routing (hello@, rickie@)
  - Configure www redirect

- [x] Basic styling setup (1 hr)
  - Tailwind CSS v4 (CSS-first, `docs/STYLE_SYSTEM.md`)
  - Dark mode support (auto via `prefers-color-scheme` + manual toggle)
  - Design tokens/variables in `src/app/globals.css`

- [x] Project scaffolding (1-2 hrs)
  - Page components: home, about, work, projects, consulting, contact, resume, privacy, terms
  - Layout component (`src/app/layout.tsx`)
  - SEO metadata structure (`src/lib/seo.ts`)

**Time: 5.5-6.5 hours**

### Content Gathering

**Chatter Snow:**

- [ ] Gather all materials (2-3 hrs) — narrative content (problem, goals, decisions) is written and shipped in `content/work/chatter-snow/index.mdx`; no screenshots were ever added (the shipped MDX has no `heroImage`/`images` fields)
  - Screenshots of key interfaces (admin, community view, dashboard) — still outstanding
  - List all features built
  - Find any metrics or impact data
  - Collect technical documentation
  - Note any architectural decisions you remember

- [x] Organize materials (1 hr) — shipped at `content/work/chatter-snow/` (not the originally-planned `content/case-studies/chatter-snow/`), with the case study written in full rather than as a rough outline

**Personal Finance:**

- [ ] Decide final scope (30 min)
  - Review MVP checklist
  - Confirm: What features in week 2-3?
  - What's explicitly out of scope?

- [ ] Create data model sketch (1 hr)
  - On paper or in Figma
  - Accounts, transactions, categories, rules
  - Keep it simple for MVP

**Time: 4.5-5 hours**

### Week 1 Total: ~10-11.5 hours

**Status:** Repo ready, content gathered, domain pointing

---

## Week 2: Website MVP + Chatter Snow Case Study (Sept 8-14)

### Write Chatter Snow Case Study

**This is the most important task of the week.**

- [x] Write case study (rough draft) (4-5 hrs) — shipped as a full case study, not a rough draft, in `content/work/chatter-snow/index.mdx`
  - Follow case study template in CASE_STUDIES.md
  - Sections: Overview, Problem, Context, Goals, Constraints, Architecture, Design, Implementation, Challenges, Decisions, Result, Lessons
  - Don't aim for perfection, aim for clarity
  - Include screenshots at key points — still outstanding, no screenshots were added
  - Note where data/metrics are TBD

**Key points to cover:**
- You're on the board + director of tech ops
- Initial driver was inventory, expanded to full platform
- Tech choices: Next.js, Supabase, Zoho integration, Vercel
- Trade-offs: What you didn't build (mobile, custom CMS, etc.)
- What Chatter can do now that it couldn't before

### Build Website Pages

**Homepage:**

- [x] Hero section (2 hrs)
  - Name + tagline
  - Supporting copy
  - CTAs: "View my work" + "Let's talk"

- [x] Featured work section (2 hrs)
  - Show Chatter Snow case study preview
  - Show Personal Finance project preview (can be placeholder initially)
  - Use grid layout, responsive

**Case Study Page:**

- [x] Case study template (2 hrs) — `src/components/case-study/` (`project-detail.tsx`, `decision-box.tsx`, `project-links.tsx`)
  - Create re-usable case study layout
  - Sections for each part (problem, solution, tech decisions, etc.)
  - Image gallery for screenshots — no gallery built; no screenshots exist for either project yet
  - Related projects links

- [x] Publish Chatter Snow case study (2 hrs)
  - Convert markdown to component/MDX
  - Add screenshots — not done, no screenshots exist
  - Test responsiveness — not independently verified; do a manual pass

**Supporting Pages:**

- [x] About page (2 hrs)
  - Who I am, What I do, How I work
  - Experience, Currently, Outside of work
  - Make it personal

- [x] Consulting page (1.5 hrs)
  - Services overview
  - Nonprofit/community support info
  - Starting prices

- [x] Contact page (1 hr)
  - Form with fields: name, email, organization, category, message
  - Category selector
  - Form handling (setup server-side submission) — `src/app/api/contact/route.ts`, with tests

**Supporting:**

- [x] Resume page (1 hr)
  - Online version
  - Download PDF link

- [x] Navigation (1 hr)
  - Header/nav component (`src/components/site/header.tsx`, `nav-links.tsx`)
  - Mobile menu (`mobile-nav.tsx`)
  - Dark mode toggle (`theme-toggle.tsx`)

### Styling & Polish

- [ ] Responsive design pass (2 hrs) — Tailwind responsive utilities are used throughout, but breakpoints haven't been independently verified with a manual/device pass
  - Mobile-first review
  - Test all breakpoints
  - Fix spacing, typography

- [x] Dark mode implementation (1 hr)
  - Dark theme CSS variables
  - Toggle functionality
  - Persist preference (localStorage)

### Week 2 Total: ~22-23 hours

**Status:** Website MVP live with Chatter Snow case study, all basic pages

---

## Week 3: Website Polish + Begin Personal Finance (Sept 15-21)

### Finish Website

**SEO & Metadata:**

- [x] SEO setup (2 hrs)
  - Meta tags for each page
  - Open Graph images (social preview) — `openGraph` metadata (title/description/url) present on work & project pages; no dedicated OG image is generated yet
  - sitemap.xml — `src/app/sitemap.ts`
  - robots.txt — `src/app/robots.ts`
  - Structured data (Person, WebSite schemas) — `src/lib/seo.ts` (`buildPersonJsonLd`, `buildWebsiteJsonLd`), plus CreativeWork/SoftwareApplication per project

**Accessibility:**

- [x] Accessibility audit (2 hrs) — addressed at the code level (WCAG AA contrast fix in `globals.css`, corrected heading hierarchy on listing pages, skip link, visible focus states); not run through a screen reader or axe/WAVE
  - Keyboard navigation (Tab, Enter, focus visible)
  - Screen reader testing (semantic HTML) — not run
  - Color contrast check — done (see `docs/BRAND_GUIDE.md` muted-text fix)
  - Heading hierarchy — fixed a skip on the listing pages
  - Alt text for images
  - Form labels

**Analytics:**

- [x] Set up analytics (1 hr) — shipped with **Vercel Analytics**, not Plausible/Fathom as originally suggested
  - Event tracking (project_view, contact_started, etc.) — all 8 named events from `docs/WEBSITE_REQUIREMENTS.md` are wired in `src/lib/analytics.ts` (github_click/linkedin_click exist but aren't attached to a link yet — no real profile URLs in the site content)
  - No unnecessary cookies

**Performance:**

- [ ] Performance optimization (2 hrs) — not benchmarked; no Lighthouse run recorded
  - Image optimization (next/image)
  - Lazy loading where appropriate
  - Remove unnecessary dependencies
  - Build and test Lighthouse scores

### Prep for Personal Finance Launch

- [x] Create repo (1 hr) — scaffolded as `finance-os/` (Next.js 16 + TypeScript + Tailwind v4, matching `personal-home`'s stack); Supabase setup and environment variables still outstanding
  - Next.js + TypeScript
  - Supabase setup
  - Environment variables

- [ ] Database schema (2 hrs)
  - Create tables: accounts, transactions, categories, categorization_rules, recurring_expenses, income_sources
  - Set up relationships
  - Add row-level security

- [ ] Authentication (1 hr)
  - Supabase auth setup
  - Simple login/signup (you only)
  - Protect pages/API routes

### Begin Personal Finance Build (Week 2-3 work)

**Dashboard:**

- [ ] Net worth calculation (2 hrs)
  - Sum accounts by type
  - Calculate assets - liabilities

- [ ] Cash runway calculation (2 hrs)
  - Get essential + total monthly expenses
  - Calculate months of runway
  - Calculate cash floor date

- [ ] Dashboard UI (2 hrs)
  - Display net worth widget
  - Display cash runway widget
  - Display quick stats
  - Make it look good

**Accounts:**

- [ ] Accounts CRUD (2 hrs)
  - Add account form (name, type, balance)
  - Edit account
  - Delete account
  - List accounts with current balances
  - Calculate total assets/liabilities

**Transactions (Basic):**

- [ ] Manual transaction entry (2 hrs)
  - Create transaction form
  - Assign to account
  - Basic categorization
  - List recent transactions

- [ ] CSV import (2 hrs)
  - Upload CSV
  - Map columns
  - Preview transactions
  - Deduplication logic
  - Import to database

### Week 3 Total: ~23-24 hours (split: ~12 website, ~12 finance)

**Status:** Website feature-complete + live. Personal Finance core functionality building.

---

## Week 4: Website Launch + Personal Finance MVP (Sept 22-28)

### Final Website Push

**Testing:**

- [ ] Full site testing (2 hrs) — automated coverage exists for the contact API route (Vitest + Testing Library, `src/app/api/contact/__tests__/route.test.ts`); the rest below is manual and unverified
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Mobile testing (iOS Safari, Android Chrome)
  - Form submission testing — covered by automated tests
  - Link validation
  - Dark/light mode toggle

**Final Tweaks:**

- [ ] Copy review (1 hr)
  - Read all copy out loud
  - Fix typos, awkward phrasing
  - Ensure tone is consistent

- [ ] Visual polish (1 hr)
  - Spacing consistency
  - Typography hierarchy
  - Color usage
  - Micro-interactions

**Launch:**

- [ ] Deploy to production (30 min)
  - Verify domain points correctly
  - Test live site
  - Check analytics is firing

- [ ] Announce (1 hr)
  - LinkedIn post
  - Maybe email to close network
  - Update GitHub

### Continue Personal Finance

**Categorization:**

- [ ] Category system (2 hrs)
  - Pre-defined categories
  - Rules engine (merchant contains X → category Y)
  - Manual override
  - Category list UI

- [ ] Transaction categorization UI (2 hrs)
  - Show uncategorized transactions
  - Assign categories
  - Apply rules
  - Edit category assignments

**Debt Tracking:**

- [ ] Debt accounts & tracking (2 hrs)
  - Debt-specific fields (APR, minimum payment, due date)
  - Debt dashboard
  - Total debt display

- [ ] Payoff calculator (2 hrs)
  - Avalanche strategy
  - Snowball strategy
  - Custom strategy
  - Show payoff timeline

**Cash Flow & Forecast:**

- [ ] Cash flow calculation engine (2 hrs)
  - Monthly cash flow projection
  - Calculate based on income + expenses

- [ ] Forecast view (2 hrs)
  - 30/60/90 days + 6/12 months
  - Show projected cash at each point
  - Flag warnings (cash shortage)
  - Show assumptions

**Income:**

- [ ] Income sources (1 hr)
  - Add income sources (salary, severance, unemployment)
  - Track dates and amounts

**Polish:**

- [ ] Basic styling (1 hr)
  - Dark mode
  - Responsive design
  - Typography

- [ ] Testing (1 hr)
  - Enter sample data
  - Verify calculations are correct
  - Check for bugs

### Week 4 Total: ~22-23 hours (split: ~6 website, ~16-17 finance)

**Status:** Website live and generating potential leads. Personal Finance MVP mostly complete.

---

## Post-Week 4 (Sept 29+)

### Add Personal Finance to Website

- [ ] Write case study (3-4 hrs)
- [ ] Add to website (1-2 hrs)
- [ ] Deploy website update (30 min)

### Continue Personal Finance Development

**Optional MVP features you might add:**

- [ ] Recurring expense auto-detection
- [ ] Alerts/notifications
- [ ] More advanced charts
- [ ] Export functionality
- [ ] Net worth tracking over time

---

## Total Time Breakdown

| Phase                    | Hours | Week |
|--------------------------|-------|------|
| **Website Setup**        | 5-6   | 1    |
| **Content Gathering**    | 4-5   | 1    |
| **Case Study Writing**   | 4-5   | 2    |
| **Website Build**        | 18    | 2-3  |
| **Website Polish**       | 8-10  | 3-4  |
| **Finance (Weeks 2-3)**  | 25-26 | 2-3  |
| **Finance (Week 4)**     | 17    | 4    |
| **Finance Polish**       | 5-10  | 4+   |
| **Add Finance to Site**  | 4-6   | 4+   |
| **Buffer/Contingency**   | ~10   | All  |
| **TOTAL (estimated)**    | ~100-115 | 4 weeks (if 25-30 hrs/week) |

---

## Weekly Commitment Estimate

**Week 1:** 10-12 hours
**Week 2:** 22-24 hours
**Week 3:** 24 hours (split between website/finance)
**Week 4:** 22-24 hours

**Average:** ~20-23 hours/week

If you're doing 25-30 hours/week, you'll have buffer for life stuff and unexpected issues.

---

## Key Milestones

✅ **Sept 7 (End Week 1):** Domain set up, repo ready, content gathered

✅ **Sept 14 (End Week 2):** Website live with Chatter Snow case study

✅ **Sept 21 (End Week 3):** Website complete, Personal Finance MVP 70% done

✅ **Sept 28 (End Week 4):** Website live, Personal Finance MVP complete

✅ **Early October:** Add Personal Finance case study to website

---

## Risk Management

**If you get stuck:**

1. **On website design:** Keep it simple. Focus on content hierarchy over visual innovation. Boring websites launch faster.

2. **On case study writing:** Just write. Don't edit as you go. Get it down, then refine.

3. **On Personal Finance scope:** Anything not in the MVP checklist gets pushed to v1.1. Don't let it block launch.

4. **On time:** If you run short, prioritize:
   - Website launch (even minimal)
   - Chatter Snow case study
   - Finance can be a bit rough for MVP

5. **On quality:** Lighthouse 90+ is nice but not worth 2 extra weeks. Launch at 85+ and improve.

---

## Success Criteria

**Website Launch (Sept 14-28):**
- ✅ Domain points correctly
- ✅ Homepage + all pages working
- ✅ Chatter Snow case study published
- ✅ Contact form receives submissions
- ✅ Accessible on mobile
- ✅ No broken links

**Personal Finance MVP (Oct 1):**
- ✅ Can add accounts
- ✅ Can import/enter transactions
- ✅ Can categorize transactions
- ✅ Dashboard shows net worth + cash runway
- ✅ Forecast projects 12 months ahead
- ✅ Debt payoff calculator works

Neither needs to be perfect. Both need to be useful and demonstrate capability.

---

## What NOT to Do

❌ Don't redesign mid-project
❌ Don't build a CMS for the website (yet)
❌ Don't do bank integrations for finance (manual/CSV only)
❌ Don't optimize for SEO before content is written
❌ Don't add features to either that aren't in the MVP spec
❌ Don't wait for Personal Finance to be perfect before launching website
❌ Don't aim for pixel-perfect design (aim for good)
❌ Don't over-engineer security before MVP is working

---

## Questions to Answer Before Starting

1. **Can you get Chatter Snow screenshots this week?** (If no, that delays timeline)
2. **Do you have access to historical financial data for Personal Finance?** (CSV export from bank)
3. **How much time per week can you realistically commit?** (Adjust timeline accordingly)
4. **Do you have a design direction in mind, or want to start with structure?** (Impacts Week 1-2)
5. **Any technical blockers I'm not aware of?** (Clarify before starting)
