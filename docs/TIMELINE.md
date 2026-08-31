# Development Timeline — 4 Week Rollout

## Philosophy

Path B: Launch website quickly with Chatter Snow case study, then build Personal Finance without time pressure.

**Week 1:** Setup + Content gathering
**Week 2:** Build website MVP + Chatter Snow case study
**Week 3:** Continue website + Begin Personal Finance project
**Week 4:** Polish + Launch website, ongoing Personal Finance development

---

## Week 1: Setup + Content (Sept 1-7)

### Website Setup

**Tasks:**

- [ ] Create Next.js repo: `rickiecruz.com` (1 hr)
  - TypeScript configuration
  - ESLint/Prettier setup
  - Basic folder structure (components, pages, public, styles)

- [ ] Set up Vercel project (30 min)
  - Connect GitHub repo
  - Set environment variables
  - Configure domain rickiecruz.com

- [ ] Set up DNS with Cloudflare (1 hr)
  - Point rickiecruz.com to Vercel
  - Set up email routing (hello@, rickie@)
  - Configure www redirect

- [ ] Basic styling setup (1 hr)
  - Choose CSS-in-JS or Tailwind
  - Set up dark mode support
  - Create design tokens/variables

- [ ] Project scaffolding (1-2 hrs)
  - Create page components (index, about, work, projects, consulting, contact, resume)
  - Create layout component
  - Set up SEO metadata structure

**Time: 5.5-6.5 hours**

### Content Gathering

**Chatter Snow:**

- [ ] Gather all materials (2-3 hrs)
  - Screenshots of key interfaces (admin, community view, dashboard)
  - List all features built
  - Find any metrics or impact data
  - Collect technical documentation
  - Note any architectural decisions you remember

- [ ] Organize materials (1 hr)
  - Create `/content/case-studies/chatter-snow/` folder
  - Save screenshots with descriptive names
  - Create rough outline of case study

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

- [ ] Write case study (rough draft) (4-5 hrs)
  - Follow case study template in CASE_STUDIES.md
  - Sections: Overview, Problem, Context, Goals, Constraints, Architecture, Design, Implementation, Challenges, Decisions, Result, Lessons
  - Don't aim for perfection, aim for clarity
  - Include screenshots at key points
  - Note where data/metrics are TBD

**Key points to cover:**
- You're on the board + director of tech ops
- Initial driver was inventory, expanded to full platform
- Tech choices: Next.js, Supabase, Zoho integration, Vercel
- Trade-offs: What you didn't build (mobile, custom CMS, etc.)
- What Chatter can do now that it couldn't before

### Build Website Pages

**Homepage:**

- [ ] Hero section (2 hrs)
  - Name + tagline
  - Supporting copy
  - CTAs: "View my work" + "Let's talk"

- [ ] Featured work section (2 hrs)
  - Show Chatter Snow case study preview
  - Show Personal Finance project preview (can be placeholder initially)
  - Use grid layout, responsive

**Case Study Page:**

- [ ] Case study template (2 hrs)
  - Create re-usable case study layout
  - Sections for each part (problem, solution, tech decisions, etc.)
  - Image gallery for screenshots
  - Related projects links

- [ ] Publish Chatter Snow case study (2 hrs)
  - Convert markdown to component/MDX
  - Add screenshots
  - Test responsiveness

**Supporting Pages:**

- [ ] About page (2 hrs)
  - Who I am, What I do, How I work
  - Experience, Currently, Outside of work
  - Make it personal

- [ ] Consulting page (1.5 hrs)
  - Services overview
  - Nonprofit/community support info
  - Starting prices

- [ ] Contact page (1 hr)
  - Form with fields: name, email, organization, category, message
  - Category selector
  - Form handling (setup server-side submission)

**Supporting:**

- [ ] Resume page (1 hr)
  - Online version
  - Download PDF link

- [ ] Navigation (1 hr)
  - Header/nav component
  - Mobile menu
  - Dark mode toggle

### Styling & Polish

- [ ] Responsive design pass (2 hrs)
  - Mobile-first review
  - Test all breakpoints
  - Fix spacing, typography

- [ ] Dark mode implementation (1 hr)
  - Dark theme CSS variables
  - Toggle functionality
  - Persist preference (localStorage)

### Week 2 Total: ~22-23 hours

**Status:** Website MVP live with Chatter Snow case study, all basic pages

---

## Week 3: Website Polish + Begin Personal Finance (Sept 15-21)

### Finish Website

**SEO & Metadata:**

- [ ] SEO setup (2 hrs)
  - Meta tags for each page
  - Open Graph images (social preview)
  - sitemap.xml
  - robots.txt
  - Structured data (Person, WebSite schemas)

**Accessibility:**

- [ ] Accessibility audit (2 hrs)
  - Keyboard navigation (Tab, Enter, focus visible)
  - Screen reader testing (semantic HTML)
  - Color contrast check
  - Heading hierarchy
  - Alt text for images
  - Form labels

**Analytics:**

- [ ] Set up analytics (1 hr)
  - Privacy-conscious option (Plausible, Fathom, or similar)
  - Event tracking (project_view, contact_started, etc.)
  - No unnecessary cookies

**Performance:**

- [ ] Performance optimization (2 hrs)
  - Image optimization (next/image)
  - Lazy loading where appropriate
  - Remove unnecessary dependencies
  - Build and test Lighthouse scores

### Prep for Personal Finance Launch

- [ ] Create repo (1 hr)
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

- [ ] Full site testing (2 hrs)
  - Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - Mobile testing (iOS Safari, Android Chrome)
  - Form submission testing
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
