# Quick Start Guide

> **Status:** The website (rickiecruz.com) side of this plan has shipped — see `personal-home/` and the root `CLAUDE.md`. It was built in a single implementation pass rather than across the calendar weeks below. Personal Finance OS has not been started; it remains a separate, not-yet-created project. Sections below are reconciled against what actually got built where that's verifiable from the repo (tech choices, file structure, feature completeness); personal/logistics items — domain registration, hosting accounts, social posts, hours spent — aren't something a repo can confirm, so those are left as originally written.

## What You're Building

**Two projects, one timeline:**

1. **Website (rickiecruz.com)** — Portfolio + consulting lead gen
   - Launch: Week 2-4 (4 weeks total)
   - Contains: Chatter Snow case study, Personal Finance case study (after), About, Consulting, Contact, Resume

2. **Personal Finance OS** — Financial management dashboard for yourself
   - Launch: Week 2-3 start, MVP by Week 4, improve ongoing
   - Use it yourself, document as case study

---

## Pre-Launch Checklist (Before Week 1)

- [ ] Domain registered: **rickiecruz.com**
- [ ] GitHub account ready (create `rickiecruz.com` repo)
- [ ] Vercel account (connect GitHub)
- [ ] Supabase account (for finance app)
- [ ] Collected Chatter Snow screenshots/docs
- [ ] Have access to financial data (bank CSV/spreadsheet)
- [ ] Confirmed time commitment (~20-25 hrs/week)

---

## Week-by-Week Summary

### Week 1 (Setup + Content)
**Time: ~10-12 hours**

- Set up Next.js repo, Vercel, domain, DNS
- Gather Chatter Snow materials
- Organize content
- Create data model sketch for finance app

**Status end of week:** Repo ready, content gathered, domain pointing

### Week 2 (Website MVP)
**Time: ~22-24 hours**

- Write Chatter Snow case study
- Build website pages (Homepage, About, Consulting, Contact, Resume)
- First finance features (Dashboard, Accounts)

**Status end of week:** Website live with Chatter Snow case study

### Week 3 (Polish Website + Finance MVP)
**Time: ~24 hours**

- Website: SEO, Accessibility, Analytics, Performance
- Finance: Transactions, Categorization, Debt, Forecast

**Status end of week:** Website feature-complete, Finance 70% done

### Week 4 (Launch + Finalize)
**Time: ~22-24 hours**

- Website: Final testing, deploy to production
- Finance: Complete MVP, polish, basic testing
- Announce website live

**Status end of week:** Website live, Finance MVP complete, generating leads

---

## File Structure

Planned as a Pages Router layout below. It shipped as Next.js **App Router**
instead — the actual structure, under `personal-home/`:

```
personal-home/
├── src/app/
│   ├── page.tsx                 (homepage)
│   ├── about/page.tsx
│   ├── work/
│   │   ├── page.tsx             (work listing)
│   │   └── [slug]/page.tsx      (case study detail)
│   ├── projects/
│   │   ├── page.tsx             (project listing)
│   │   └── [slug]/page.tsx      (project detail)
│   ├── consulting/page.tsx
│   ├── contact/page.tsx
│   ├── resume/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── globals.css
│   └── api/contact/route.ts     (form submission)
│
├── src/components/
│   ├── site/                    (header, footer, nav-links, mobile-nav, theme-toggle, skip-link)
│   ├── case-study/               (project-detail, decision-box, project-links)
│   ├── contact/contact-form.tsx
│   ├── analytics/                (track-project-view, track-consulting-view)
│   ├── mdx/mdx-components.tsx
│   └── ui/                       (shadcn/ui primitives)
│
├── src/lib/
│   ├── content/                 (MDX loading + frontmatter parsing)
│   ├── analytics.ts
│   ├── email/                   (Resend integration)
│   ├── rate-limit.ts
│   ├── seo.ts                   (Person/WebSite/CreativeWork JSON-LD)
│   ├── theme-store.ts
│   └── validation/
│
├── content/
│   ├── work/chatter-snow/index.mdx
│   └── projects/personal-finance-os/index.mdx
│
├── next.config.ts
├── tsconfig.json
└── package.json                 (Tailwind v4 is CSS-first — no tailwind.config.js)
```

---

## Key Files to Create First

### Week 1

```
✓ GitHub repo created
✓ Vercel project created
✓ Basic Next.js structure
✓ content/work/chatter-snow/index.mdx (start drafting)
```

### Week 2

```
✓ src/app/page.tsx (homepage)
✓ src/app/work/[slug]/page.tsx (case study template)
✓ src/app/about/page.tsx
✓ src/app/consulting/page.tsx
✓ src/app/contact/page.tsx
✓ src/components/site/header.tsx, footer.tsx; case-study/project-detail.tsx
```

### Week 3-4

```
✓ All pages styled
✓ SEO metadata
✓ Analytics tracking
✓ Performance optimization
✓ Accessibility fixes
```

---

## Critical Decisions (Made)

1. **Styling approach?**
   - → Tailwind CSS v4 (CSS-first, no `tailwind.config.js` — see `docs/STYLE_SYSTEM.md`)

2. **Components?**
   - → shadcn/ui, recolored to the brand tokens instead of shadcn's default palette

3. **MDX or JSON for content?**
   - → MDX, read via `next-mdx-remote` + `gray-matter` from `content/work/` and `content/projects/`

4. **Dark mode?**
   - → Yes, with a manual toggle (persisted client-side) that falls back to `prefers-color-scheme`

5. **Fonts?**
   - → Google Fonts via `next/font`: Inter (body/headings), Merriweather (rare pull-quote use only), Geist Mono (code)

6. **Form submission?**
   - → Resend, with a honeypot, rate limiting (`src/lib/rate-limit.ts`), and server-side validation

---

## Core Requirements (Non-Negotiable)

✅ **Website must:**
- Be responsive (mobile, tablet, desktop)
- Have excellent typography
- Be keyboard-navigable
- Have Lighthouse 90+
- Include Chatter Snow case study
- Have working contact form
- Be hosted on rickiecruz.com

✅ **Personal Finance must:**
- Track accounts and transactions
- Calculate net worth and cash runway
- Show spending by category
- Project cash flow 12 months ahead
- Calculate debt payoff strategies
- Actually be useful (you'll use it)

---

## What You Can Skip for MVP

❌ Don't build:
- Bank integrations (Plaid)
- CMS admin panel
- Blog
- Advanced reporting
- Mobile app
- Recurring expense detection (manual okay)
- Scenarios/"what if" analysis
- Net worth tracking over time
- User auth for website (public)
- Anything requiring a database for website (git + markdown is fine)

---

## Success Metrics

**Website launch (Week 2-4):**
- ✅ Site live on rickiecruz.com
- ✅ Lighthouse 90+
- ✅ Responsive on all devices
- ✅ Case study published
- ✅ Contact form works
- ✅ No broken links

**Personal Finance MVP (Week 4+):**
- ✅ Can add accounts
- ✅ Can import transactions
- ✅ Dashboard shows accurate net worth
- ✅ Cash runway calculation works
- ✅ Can categorize spending
- ✅ Forecast projects 12 months
- ✅ You're actually using it

**Leading indicators:**
- 1+ consulting inquiry from site
- Personal Finance makes a financial decision you wouldn't have made
- Website feels fast (actual vs. perceived)
- Friends say "wow, this looks professional"

---

## Time Estimate Breakdown

| Task Category        | Hours | When |
|----------------------|-------|------|
| Setup (repo, domain) | 6     | W1   |
| Case study writing   | 5     | W2   |
| Website build        | 18    | W2-3 |
| Website polish       | 10    | W3-4 |
| Finance MVP          | 45    | W2-4 |
| Buffers/contingency  | 15    | All  |
| **Total**            | ~100  | 4 wks|
| **Per week**         | ~25   | Avg  |

---

## Burndown (if you want to track)

**Target:** 100 hours over 4 weeks

- **After Week 1:** 10 hours done, 90 remaining
- **After Week 2:** 35 hours done, 65 remaining
- **After Week 3:** 60 hours done, 40 remaining
- **After Week 4:** 100 hours done, 0 remaining (MVP ships)

---

## Daily Workflow Suggestion

**Morning (2-3 hrs):**
- Coffee ☕
- Review yesterday's work
- Check if anything broke
- One focused task (e.g., "write case study" or "build accounts page")

**Afternoon (2-3 hrs):**
- Another focused task
- Test if possible
- Take a break

**Evening (optional, 1-2 hrs):**
- Polish
- Think about next day
- Review progress

**Day off:** Take one full day off per week (weekends?)

---

## Stuck? Here's What to Do

### If design feels hard:
- Look at other portfolios for inspiration
- Use a design system (shadcn/ui)
- Don't over-design; simpler is better
- Default to solid colors + good typography

### If writing case study is hard:
- Just write badly first
- Answer the questions in order (problem, solution, result)
- Don't edit while writing
- Fix after you have draft done

### If finance calculations are wrong:
- Print out your actual bank statements
- Manually calculate expected cash runway
- Compare to app output
- Fix the calculation logic
- Test again

### If you're behind schedule:
- Cut scope (no nice-to-have features)
- Reduce perfection (Lighthouse 85 is okay)
- Ship anyway; fix later
- You can always improve v1.1

### If motivation is low:
- Remember: you're solving real problems
- Show someone your progress
- Ship something, even if rough
- Celebrate small wins

---

## Communication Checklist

**Week 1 (Thursday):**
- Send quick message to close people: "Starting website project this week"

**Week 2 (Friday):**
- Post to LinkedIn: Website launching soon
- Maybe sneak peek

**Week 4 (Friday):**
- Announce: Website is live! 🎉
- Post screenshot
- Share link

**Post-launch:**
- Let people know if you're available for consulting
- Share a case study link if interesting opportunity comes up

---

## Resources to Keep Handy

**Documentation:**
- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs

**Tools:**
- GitHub (version control)
- VS Code (editor)
- Figma (design, if needed)
- Chrome DevTools (debugging)
- WAVE (accessibility testing)
- Lighthouse (performance testing)

**Inspiration:**
- dribbble.com (design ideas)
- awwwards.com (websites)
- GitHub (how others structure projects)

---

## Future Reference

Once you ship MVP, you can:

1. **Add Personal Finance case study** to website (2-3 hrs)
2. **Add blog** if you want to write (medium effort)
3. **Add more case studies** as you complete projects (easy, reuse template)
4. **Add email newsletter** for leads (low priority)
5. **Build consulting CRM** to track leads (only if getting many)
6. **Add bank sync** to finance if tedious importing (medium effort)
7. **Build "what if" scenarios** for finance (fun but not critical)

The site is built to support all of this without major redesign.

---

## Your North Star

**Remember the goal:**

When a nonprofit founder lands on rickiecruz.com, they should think:

> "This person understands my problems. They know how to build something useful. I should talk to them."

Not:

> "Wow, cool animations"

or

> "I don't know what this person does"

Every decision should support that goal.

The site demonstrates your quality through:
- Clear, thoughtful design
- Case studies that show your thinking
- Fast, accessible experience
- Professional presence

The content matters more than the code.

---

## Let's Go 🚀

You've got this. Four weeks. Two projects. One goal: Launch.

**First task:** Register rickiecruz.com

**Second task:** Create GitHub repo

**Third task:** Create Vercel project

**Fourth task:** Write the Chatter Snow case study (get it out of your head)

After that, everything else is building blocks.

Go build something great.
