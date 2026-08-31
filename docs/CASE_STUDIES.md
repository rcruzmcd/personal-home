# Case Studies

## Overview

Case studies are the most important part of your portfolio. Each should explain **how you think**, not just what you built.

Focus on demonstrating:
- Problem identification
- Pragmatic decision-making
- Trade-offs and constraints
- Engineering judgment
- Ability to operate across product, design, engineering, architecture

## Case Study Template

```
1. Overview — What is this?
2. Problem — What problem did you solve?
3. Context — Background and constraints
4. Goals — What were you trying to accomplish?
5. Constraints — Timeline, budget, team, etc.
6. Research/Discovery — How did you understand the problem?
7. Architecture — How did you structure the solution?
8. Design — Approach to UI/UX
9. Implementation — How you built it
10. Challenges — What was hard?
11. Decisions — Key trade-offs and why
12. Result — What's the outcome?
13. Lessons Learned — What did you learn?
```

---

# Case Study #1: Chatter Snow

## Overview

**Project:** Chatter Snow Digital Operations Platform

**Your Role:** Board Member + Director of Digital Operations

**What it is:** The technical infrastructure supporting Chatter Snow, an LGBTQ+ ski and snowboard nonprofit. Evolved from inventory management to a comprehensive operations platform.

**Status:** Live (went live late August 2026)

## Problem

Chatter Snow was growing rapidly (more donations, more gear, more community interest) but had no system to:
- Track inventory of donated gear
- Share what equipment was available to community members
- Coordinate volunteers
- Manage events
- Handle finances
- Organize donations

Everything was scattered:
- Spreadsheets (manual, unreliable)
- Email threads (lost context)
- No visibility for community members
- Didn't scale

**Core issue:** As an organization trying to serve the community, Chatter couldn't easily tell people "Here's what we have available" or manage operations efficiently.

## Context

- Nonprofit with limited budget and volunteer team
- Growing inventory of donated ski/snowboard gear
- Active community of members who wanted to know what was available
- Existing infrastructure: Zoho for some communications
- Your role: Board member + technical lead = you saw both operational need AND technical constraints

## Goals

1. Create centralized inventory system
2. Enable community to see available gear without email/phone calls
3. Reduce manual admin work
4. Build foundation for future growth (volunteers, events, giving, etc.)
5. Keep it maintainable by volunteers (not over-engineered)

## Constraints

- Nonprofit budget (minimal)
- Volunteer-driven (can't be complex)
- Need to launch quickly (community was waiting)
- No dedicated devops/infrastructure team
- Growing organization (needs to scale)

## Research/Discovery

As board member + director, you understood:
- Actual operational workflows
- Community member expectations
- Staff pain points
- Budget reality
- Volunteer capabilities

**Key insight:** Don't rebuild everything. Integrate with what Chatter already uses (Zoho). Start narrow (inventory) but design for expansion.

## Architecture

**Core philosophy:** Minimal, maintainable, integrated

```
Frontend              Backend            Data             Services
─────────────────────────────────────────────────────────
Next.js       ←→   Vercel Edge    ← Supabase      ← Zoho Email
TypeScript       Functions          PostgreSQL     (Comms)
(Admin UI)                           (Inventory,
              ←→   API routes          Events,
(Community        (Handle            Volunteers,
 view)           mutations,          Financials)
                 auth, logic)
              ←→                   ← Cloudflare
                                   (CDN, DNS)
```

**Why these choices:**
- **Next.js + TypeScript** — Fast iteration, full-stack capability, you know it
- **Supabase + PostgreSQL** — Simple relational data, good for complex operations, cost-effective
- **Zoho integration** — Chatter already uses it; don't replace existing tools
- **Vercel** — Simple deployment, serverless functions, fast
- **Cloudflare** — Global CDN, DNS management, DDoS protection

**What you didn't build:**
- Custom CMS (Supabase admin interface is good enough)
- Extensive reporting (focused on core operations)
- Mobile app (web-responsive is sufficient)
- Complex authentication (simple role-based access)

## Design

**Approach:** Functional, clear, focused on usability

**Key interfaces:**
- Admin dashboard (inventory management, volunteer coordination, event creation)
- Community-facing gear view (what's available to rent/borrow)
- Volunteer coordination (shift signup, event management)
- Financial tracking (donations, expenses)

**Design philosophy:** Prioritize clarity over visual polish. Volunteers need to understand the system quickly.

## Implementation

**Initial phase:**
1. Inventory management (core problem)
2. Community-facing gear view
3. Basic volunteer coordination

**Evolved to include:**
4. Event management
5. Donation/financial tracking
6. Member communication

**Timeline:** 
- Discovery/planning: ~2 weeks
- MVP build: ~3-4 weeks
- Testing/iteration: ~2 weeks
- Launch: ~1 week

**Built with:** Volunteer time + your technical lead role

## Challenges

- **Requirement creep** — Once people see the system working, everyone wants new features
- **Design for volunteers** — Complex features but volunteers need simple interfaces
- **Data accuracy** — Getting historical inventory data into system
- **Scaling** — Vercel serverless can handle, but database optimization matters as data grows
- **Feature priority** — What's MVP vs. what can wait?

## Decisions & Tradeoffs

### Decision: Use Supabase, not Firebase

**Tradeoff:** 
- ✓ Better for complex relational data (gear, volunteers, events, financials are interconnected)
- ✗ Slightly more infrastructure to manage than Firebase

### Decision: Integrate with Zoho, don't replace it

**Tradeoff:**
- ✓ Chatter already invested in Zoho; use existing tool
- ✓ Less work to maintain
- ✗ Some redundancy in data (but worth it for simplicity)

### Decision: Community view is separate from admin

**Tradeoff:**
- ✓ Simple, focused user experience for members
- ✓ Easier to secure/scale
- ✗ Some code duplication

### Decision: Start with inventory, design for expansion

**Tradeoff:**
- ✓ Launch quickly (focused scope)
- ✓ Architecture allows adding volunteers, events, financials without redesign
- ✗ More upfront design/architecture work

### Decision: Vercel serverless functions, not traditional backend

**Tradeoff:**
- ✓ Simple scaling, cheap, minimal devops
- ✗ Cold start latency (acceptable for nonprofit use case)

## Result

**Outcomes:**
- Chatter now has centralized inventory system
- Community can see available gear without email/calls
- Admin overhead reduced for [specific tasks — TBD once more data]
- Platform now handles events, volunteers, financials, donations
- Built foundation for future growth

**Technical metrics (TBD):**
- Deployment time: X minutes
- Uptime: 99.X%
- Page load time: X ms
- Cost: ~$X/month

**Organizational impact (TBD):**
- Time saved per week/month
- Member engagement increase
- Admin efficiency gains

## Lessons Learned

1. **Start narrow, design wide** — Focusing on inventory first made launch possible, but architecture allowed for expansion

2. **Integrate, don't replace** — Chatter was already using Zoho; building on top of existing tools was faster than rebuilding everything

3. **Design for your actual users** — Volunteers have limited patience for complexity. Every feature needs to be justified.

4. **Get hands dirty** — Being on the board meant you understood real problems. That's your edge over an outside consultant.

5. **[Your additional learning]** — TBD as project matures

## What's Next

- **Near-term:** Optimize based on feedback from live usage
- **Medium-term:** Enhance reporting/analytics
- **Long-term:** Potentially add mobile app, fundraising integrations

## Resources

- **Repository:** [if public]
- **Live site:** [URL]
- **Documentation:** [internal docs link if exists]

---

# Case Study #2: Personal Finance OS

## Overview

**Project:** Personal Finance Dashboard

**Your Role:** Sole Developer

**What it is:** A financial management system to track cash, debt, spending, and forecast runway. Built to solve your own problem after job loss.

**Status:** In development (launching Sept 2026)

## Problem

After getting laid off, you needed to:
- See all your money across multiple accounts
- Understand monthly burn rate
- Calculate how long severance would last
- Make informed decisions about spending and job search

**Reality of job loss:** Traditional spreadsheets are tedious to maintain, and you can't easily see the big picture.

**Existing solutions:**
- Mint/Personal Capital — Overkill for your needs, don't answer core questions
- Spreadsheets — Tedious, hard to maintain, limited insights
- Nothing felt like it solved the actual problem: "How long can I sustain this?"

## Context

- Personal project (solving your own problem)
- No external deadline (building sustainably)
- Opportunity to showcase UI/data viz skills
- Real data = real case study (you'll use this regularly)
- Personal finance data requires thoughtfulness around security/privacy

## Goals

1. Create single source of truth for financial position
2. Answer five core questions:
   - Where is my money?
   - Where is my money going?
   - How much do I owe?
   - How long can I sustain this?
   - What should I do next?
3. Enable scenario modeling ("What if I get a job in October?")
4. Show you can build UX + data viz + backend together

## Constraints

- Personal project (lower priority than consulting leads)
- MVP must be achievable in 2-3 weeks
- Want to actually *use* it (so needs to be good)
- Security/privacy important (financial data sensitive)
- Simple enough you can maintain it

## Research/Discovery

**Your insights:**
- You've handled personal finances (know what matters)
- You know what existing tools do well and don't
- You can identify gaps in the market
- You can build something uniquely tailored to your situation

## Architecture

**Core philosophy:** Financial ledger + calculation engine, not a UI-first design

```
Data Input            Processing            Output
─────────────────────────────────────────────────────
Accounts        Financial Model         Dashboard
Transactions    (Ledger engine)         Forecast
Categories      ↓                       Scenarios
Rules           Calculations            Alerts
              (Cash flow, debt, 
               runway, net worth)
```

**Tech stack:**
- **Next.js + TypeScript** — Frontend + API routes
- **Supabase + PostgreSQL** — Relational database for complex financial data
- **Recharts** — Data visualization
- **Vercel** — Hosting

**Why Supabase over Firebase:**
- Financial data is relational (accounts, transactions, debt interconnected)
- Need complex queries (spending by category over time, etc.)
- PostgreSQL is better for financial calculations

## Design

**Approach:** Clarity over decoration. This is a tool, not art.

**Key screens:**
- Dashboard (financial position at a glance)
- Accounts (money in/out)
- Transactions (where money actually went)
- Debt (how much you owe, payoff scenarios)
- Forecast (runway projection)

**Design decisions:**
- Dark mode default (you spend a lot of time in this, dark is easier on eyes)
- Keyboard-friendly (power user tool)
- Mobile-responsive but optimized for desktop
- Color-coded categories for quick scanning

## Implementation

**MVP scope (2-3 weeks):**

**Week 1:**
- Setup: Next.js + Supabase repo (1-2 hrs)
- Data model: Accounts, transactions, categories, rules (2 hrs)
- Dashboard: Net worth, cash, debt, runway (2-3 hrs)
- Accounts: Add/edit accounts (2 hrs)
- Transaction: Entry or CSV import (3-4 hrs)

**Week 2:**
- Categorization: Rules + manual assignment (2-3 hrs)
- Debt payoff: Avalanche/snowball calculator (2 hrs)
- Forecast: 30/60/90 days + 6/12 months (3-4 hrs)
- Polish + test (2 hrs)

**Not in MVP:**
- Bank sync (Plaid integration)
- Scenarios/"What if" engine
- Advanced reports
- Budgeting module
- Net worth history/trends
- Recurring expense detection

## Challenges

- **Data quality** — Getting historical financial data into system accurately
- **Security** — Financial data requires thoughtfulness (encryption, access control)
- **Accuracy matters** — This is real money; calculations must be correct
- **Scope creep** — Financial features are infinite; need discipline on MVP
- **Making it useful** — Tool needs to actually guide decisions, not just show data

## Decisions & Tradeoffs

### Decision: MVP is narrow, launch quickly

**Tradeoff:**
- ✓ Get working tool in 2 weeks you can actually use
- ✗ Some features will be missing (but can add later)

### Decision: CSV import, not bank sync

**Tradeoff:**
- ✓ Simpler to build, launch faster
- ✓ Full control over data (important for sensitive financial data)
- ✗ Manual import required
- Later: Add Plaid integration when valuable

### Decision: Rule-based categorization, not ML

**Tradeoff:**
- ✓ Predictable and transparent (you know why transactions categorized certain way)
- ✓ Simple to maintain
- ✗ Won't auto-learn from your behavior
- Acceptable for personal finance tool

### Decision: Cash runway as central metric

**Tradeoff:**
- ✓ Most relevant metric when unemployed ("How long can I sustain?")
- ✗ Less relevant once employed (shift to budgeting/savings)
- Intentional: Build for your current situation

### Decision: No traditional budgeting module in MVP

**Tradeoff:**
- ✓ Simpler, faster to launch
- ✓ Better focus on cash flow (more urgent)
- ✗ Can't set spending limits (add in v1.1)

## Result

**What it will enable:**
- Clear visibility of financial runway
- Understanding of spending patterns
- Debt payoff scenarios
- Data-driven decisions about job search, spending, etc.

**Metrics (TBD):**
- How accurate runway prediction was vs. actual
- Time saved vs. spreadsheets
- Decisions made based on insights

**Long-term:**
- Case study showing UI + data viz + full-stack capability
- Tool you actually use (and improve)
- Portfolio piece demonstrating complete product thinking

## Lessons Learned (TBD)

- What you learned about building financial software
- Surprises in your own financial picture
- Design decisions that worked/didn't
- What you'd do differently

## Future Enhancements

- [ ] Bank sync (Plaid)
- [ ] Scenario/"What if" engine
- [ ] Advanced reporting
- [ ] Budget module
- [ ] Net worth tracking over time
- [ ] Investment tracking
- [ ] Tax planning
- [ ] Goal tracking

## Resources

- **Repository:** github.com/[yourname]/personal-finance
- **Live:** finance.rickiecruz.com or rickiecruz.com/projects/personal-finance
- **Data model:** [link to schema doc]

---

## Usage Notes for Both Case Studies

**When writing:**
- Be honest about tradeoffs (you didn't do X, here's why)
- Show your thinking (decision-making matters more than perfect execution)
- Connect to audience (employers: "See? This person understands architecture." Nonprofits: "See? I understand your constraints.")
- Include visuals (screenshots, simple diagrams)
- Keep it real (not hype, not false modesty)

**Screenshots to gather:**
- **Chatter:** Inventory view, community-facing gear view, admin dashboard, maybe one mobile screenshot
- **Finance:** Dashboard, transactions, forecast chart, maybe debt breakdown

**Diagrams:**
- **Chatter:** Simple tech stack (can be Figma, SVG, or styled code block)
- **Finance:** Data model diagram, forecast calculation visualization

**What you're proving:**
- You identify real problems
- You make pragmatic technology choices
- You understand constraints
- You think about users
- You build things that work
