# Tech Stack & Domain Strategy

## Domain & Branding

### Primary Domain
**rickiecruz.com**

- Simple, memorable, personal
- Immediately tells people who this is
- Works for portfolio + consulting lead gen
- Positions you as a person, not an agency

### Email

**Primary (professional):**
- rickie@rickiecruz.com

**Public (contact/leads):**
- hello@rickiecruz.com

**Future (project-specific):**
- projects@rickiecruz.com

All routes through domain email provider without requiring separate inboxes initially.

### Positioning

**Legal name:** Ricardo Cruz McDougal
**Professional name:** Rickie Cruz / Rickie McDougal

Brand statement:
> Software engineer who builds useful digital products and helps organizations make better technology decisions.

**Demonstrate:** Product → UI → Engineering → Architecture → Infrastructure → Operations

---

## Website Tech Stack

### Frontend

**Next.js + TypeScript**
- Why: You know it, it's powerful, perfect for portfolios
- Vercel integration is seamless
- Server-side rendering for SEO
- Incremental static regeneration for performance
- Full-stack capability (API routes for forms)

**Version:** Latest stable (Next.js 15+)

### Styling

Choose one:

**Option 1: Tailwind CSS** (Recommended)
- Utility-first CSS
- Great for rapid development
- Easy dark mode
- Minimal CSS payload
- Large ecosystem of components

**Option 2: CSS Modules**
- Scoped styles, no conflicts
- Lightweight
- Good for custom design
- Requires more manual work

**Option 3: Styled Components / Emotion**
- CSS-in-JS approach
- Flexible
- Larger JS payload
- Good if you want runtime styling

**Recommendation:** Tailwind CSS for speed and consistency.

### UI Components

**Option 1: Build from scratch**
- Full control
- Good learning
- More work
- Perfect for portfolio (shows you can design)

**Option 2: shadcn/ui**
- Copy-paste component library
- Built on Radix primitives
- Customizable
- Great for getting up fast
- Accessible by default

**Recommendation for MVP:** shadcn/ui (accessibility built-in, faster launch)

### Fonts

Use system fonts or Google Fonts:
- **Headings:** Inter or Geist (modern, clean)
- **Body:** Inter or Geist (same for consistency)
- Keep it simple; good typography > fancy fonts

Host locally, not from Google (faster, privacy-conscious).

### Dark Mode

Built-in support with Tailwind or CSS variables:
- Respect `prefers-color-scheme`
- Provide manual toggle
- Store preference in localStorage
- Default: system preference

### Icons

**Option 1: React Icons** (Quick)
- Large library of icon sets
- Simple React components

**Option 2: Custom SVG** (Better)
- Smaller payload
- Perfect for portfolio
- More work

**Recommendation:** Custom SVG for hero/feature icons, React Icons for UI (chevrons, hamburger, etc.)

### Image Handling

**Use Next.js `<Image>` component:**
- Automatic optimization
- Responsive images
- Lazy loading
- Format conversion (WebP, AVIF)
- Smaller, faster images

**Store images:**
- `/public/images/` for static content
- Reference by path in `<Image>`

### Animation & Motion

**Option 1: Framer Motion**
- Powerful animation library
- Great for micro-interactions
- Lightweight

**Option 2: CSS animations**
- No dependencies
- Good for simple transitions
- Use `prefers-reduced-motion` for accessibility

**Recommendation:** CSS transitions for simple stuff (hover, focus), Framer Motion for complex interactions. Keep it intentional, not flashy.

### Forms

**Contact form:**
- Client-side: React form handling (consider react-hook-form for simplicity)
- Server-side: Next.js API route
- Submission: Send to email (Resend, SendGrid, or similar)
- Spam protection: Server-side validation, optional reCAPTCHA
- Rate limiting: Implement on API route

**Alternative:** Services like Formspree or Basin handle this entirely, but you'll learn more building it.

### SEO

**Tools built into Next.js:**
- `next-seo` package (optional, but helpful)
- Or manually manage `<Head>` with Next.js built-in

**Per-page SEO:**
- `<title>` tag (unique per page)
- `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Canonical URLs
- Structured data (JSON-LD for Person, WebSite, CreativeWork)

**Site-wide:**
- `sitemap.xml` (Next.js app router can auto-generate)
- `robots.txt`
- Subdomain redirects (www → no-www or vice versa)

### Analytics

**Privacy-conscious option (recommended):**
- Plausible Analytics
- Fathom Analytics
- Cabin
- Why: Cookie-free, GDPR-friendly, don't collect data you don't need

**vs. Google Analytics**
- GA4 requires consent popup
- Collects a lot of data
- Overkill for portfolio

**What to track:**
- `project_view` (user clicked on case study)
- `resume_download`
- `contact_started`
- `contact_submitted`
- `consulting_view`
- Page views (basic)

### Performance Targets

- **Lighthouse Performance:** 90+
- **Lighthouse Accessibility:** 95+
- **Lighthouse SEO:** 95+
- **Lighthouse Best Practices:** 95+
- **Core Web Vitals:** All green
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Accessibility

**Built-in:**
- Semantic HTML (`<button>`, `<nav>`, `<main>`, etc.)
- Proper heading hierarchy (h1, h2, h3)
- Alt text for images
- Color contrast ratio 4.5:1 minimum (WCAG AA)
- Focus states visible
- Keyboard navigation (Tab, Enter, Escape)

**Tools:**
- WAVE browser extension (testing)
- axe DevTools (testing)
- Screen reader testing (NVDA, JAWS, VoiceOver)

**Special care:**
- `prefers-reduced-motion` media query (animations respect user preference)
- Form labels properly associated with inputs
- Error messages clear and accessible
- Skip links for keyboard users

---

## Personal Finance Tech Stack

> **Status:** Scaffolded as `finance-os/` (default `create-next-app` output — Next.js 16, React 19, TypeScript, Tailwind v4, bun). No finance features yet.

### Frontend

**Next.js + TypeScript**
- Same as website
- Consistent stack
- Full-stack capability

**Design system: shared with `personal-home`, not built separately**
- `finance-os` uses the same design system as the `personal-home` website (see `docs/BRAND_GUIDE.md` and `docs/STYLE_SYSTEM.md`) rather than the "build your own component library, document it later" plan originally sketched below — reuse `personal-home`'s Tailwind theme tokens and shadcn/ui components instead of hand-picking new ones.

### Database

**Supabase (PostgreSQL)**

**Why Supabase:**
- Managed PostgreSQL (relational data)
- Built-in auth
- Real-time subscriptions
- Row-level security (only you see your data)
- Free tier is generous
- You already use it
- Great for complex financial data (accounts, transactions, relationships)

**vs. Firebase:**
- Firebase is better for real-time, less complex data
- Financial data is relational; PostgreSQL is better

**vs. MongoDB:**
- MongoDB is document-based; relational is better for finance

### Authentication

**Supabase Auth**
- Simple signup/login (personal use)
- Google/GitHub OAuth (optional)
- Email/password (you only)
- Row-level security built-in

### Data Visualization

**Recharts** (Recommended for MVP)
- Lightweight React charting library
- Works great in Next.js
- Supports most chart types you need
- Good documentation
- Much smaller than Chart.js

**Alternative:** Chart.js (more full-featured, larger bundle)

**What you'll chart:**
- Spending by category (bar chart)
- Spending trend (line chart)
- Debt breakdown (pie chart)
- Cash runway projection (line chart)
- Net worth over time (line chart)

### State Management

**For MVP: React Context + hooks**
- No additional library needed
- Good for personal app
- Simple financial data doesn't need Redux

**Later: Consider if needed**
- If app gets complex, consider Zustand or Jotai (lighter than Redux)

### Data Fetching

**Option 1: React Query (TanStack Query)**
- Best for server state management
- Automatic caching
- Refetching logic
- Great with Supabase

**Option 2: Fetch API + useEffect**
- Simple
- No dependencies
- Works fine for personal app

**Recommendation:** React Query (worth the dependency, handles server state well)

### Forms

**react-hook-form**
- Lightweight form library
- Good validation
- Integrates well with financial forms
- Good performance

### Tables/Lists

**react-table (TanStack Table)**
- Headless table library
- Good for transaction lists, account lists
- Sorting, filtering, pagination
- Lightweight

**vs. Building from scratch:**
- Using a library is faster
- Less custom code to maintain

### Validation

**Zod**
- Schema validation library
- Type-safe
- Works server and client-side
- Great for financial data validation

**Use for:**
- Account input validation
- Transaction validation
- Income source validation
- Ensure data integrity

### Environment Variables

Store sensitive info:
- Supabase URL
- Supabase anon key
- API keys (if using external APIs)
- Form submission service keys

**In `.env.local`** (not committed to git)

Use Next.js built-in environment variable support.

### Security

**Financial data is sensitive:**
- Use HTTPS only (automatic with Vercel)
- Environment variables for secrets
- Supabase row-level security (only you access your data)
- No financial data logged
- Regular dependency updates
- No passwords/credentials stored

**Optional but good:**
- Audit logging (log who accessed what)
- Encrypted backup
- Export/delete functionality

---

## Hosting & Deployment

### Website & Finance

**Both on Vercel**

Why Vercel:
- Optimized for Next.js
- Serverless functions (API routes)
- Automatic deployment from GitHub
- Free tier is generous
- Instant deployments
- Preview deployments for testing
- Environment variables management
- Automatic SSL

**Hobby plan supports this:** no cap on number of Vercel projects on the free Hobby tier — `personal-home` and both `finance-os` instances below can each be their own project. What's capped is account-wide shared usage (bandwidth, build minutes, deployments/day), pooled across all projects, not per-project; three low-traffic personal projects stay well under those limits.

### Personal Finance: Two Instances

`finance-os` is deployed as **two separate Vercel projects**, both built from the same repo/root directory (`finance-os/`) but pointed at different Supabase projects and different domains — not a prod/preview split of one app, since these serve two different audiences:

| | Private instance | Showcase instance |
|---|---|---|
| **Purpose** | Your actual financial tracking | Public portfolio/case-study demo |
| **Data** | Real Supabase project, real accounts/transactions | Separate Supabase project, seeded with fake/sample data |
| **Domain** | Not on a discoverable `*.rickiecruz.com` subdomain — default `*.vercel.app` URL or an unadvertised subdomain, never linked from site nav | `finance.rickiecruz.com` (or `demo.rickiecruz.com`), linked from the Personal Finance OS case study |
| **Access** | Gated behind Supabase Auth (and/or Vercel Deployment Protection until auth is built) | Public, read-only or reset-on-schedule |
| **Env vars** | Points at the production Supabase project | Points at the demo Supabase project |

This means the DNS/Cloudflare setup (CNAME to Vercel, DNS-only/grey-cloud) applies only to the showcase instance's domain — the private instance doesn't need a custom domain or public DNS record at all.

### CI/CD Pipeline

**GitHub → Vercel → Production**

```
Push to main branch
        ↓
Vercel detects change
        ↓
Build (next build)
        ↓
Test (optional: run tests)
        ↓
Deploy to preview URL (for review)
        ↓
If main branch: Deploy to production
```

### Environments

**Development**
- Local machine
- `npm run dev` or `vercel dev`
- Connect to Supabase development project

**Preview**
- Vercel preview URLs
- Automatic for pull requests
- Share with others for feedback

**Production**
- rickiecruz.com
- Manual trigger or automatic on main branch push
- Connect to Supabase production project

### Backup Strategy

**Website:**
- GitHub is your backup (code)
- Markdown/MDX content in git
- Images in git (or reference public URLs)

**Personal Finance:**
- Supabase has backups (included)
- Regular exports to CSV (monthly?)
- Download as backup

---

## Dependency Management

### Keep Dependencies Minimal

- Only add if it solves a real problem
- Prefer native browser APIs when possible
- Review bundle size with `next/bundle-analyzer`

### Automated Updates

**Dependabot** (built into GitHub)
- Automatically creates PRs for updates
- Security updates are priority

### Regular Review

- Monthly: Review outdated dependencies
- Test before upgrading major versions
- Keep Next.js and React current

---

## Development Tools

### Code Quality

**ESLint**
- Catch common mistakes
- Enforce code style
- Pre-configured in Next.js

**Prettier**
- Code formatting
- Consistent style
- Run before commit

**TypeScript**
- Type safety
- Catch errors at build time
- Already required

### Testing (Optional for MVP)

**Unit Tests:** Not critical for portfolio
**E2E Tests:** Maybe after launch
**Manual Testing:** Good enough for MVP

If you want tests:
- Jest (unit tests)
- Cypress or Playwright (E2E)
- Test before deploying to production

### Performance Monitoring

**Vercel Analytics** (built-in)
- Core Web Vitals
- Real-user monitoring
- Performance trends

**Lighthouse**
- Manual checks before launch
- Automated checks before deploy (optional)

---

## Design & Development Workflow

### Design First (Optional)

You can:
- Design in Figma first, then build
- Build directly in code (component-driven)
- Start with wireframes on paper

**Recommendation:** Wireframe on paper (30 min), then code directly. You know good design; don't over-design.

### Component Library

**Build as you go:**
- Button component
- Card component
- Form component
- Layout component
- Hero component

Reuse across pages.

### Design System (Later)

Once you have 10+ components, document them:
- Component variants
- Props
- Usage examples
- Accessibility notes

---

## Monitoring & Maintenance

### Uptime Monitoring (Optional)

Services like Ping or Healthchecks:
- Monitor website availability
- Alert if down
- Not critical but nice to have

### Error Tracking (Optional)

Sentry or similar:
- Track errors in production
- Debug issues
- Not critical for MVP

### Logs

- Vercel provides function logs
- Check regularly for errors
- Monitor contact form submissions

---

## Cost Estimate (Monthly)

| Service         | Cost/mo | Notes |
|-----------------|---------|-------|
| Domain         | $12     | rickiecruz.com @ Namecheap or similar |
| Email routing  | ~$0     | Cloudflare (included in free plan) |
| Vercel         | $0      | Free tier generous, $20+ if heavy use |
| Supabase       | $0-25   | Free tier good for personal app |
| Analytics      | $5-9    | Plausible or Fathom |
| **Total**      | **$17-46** | Very low cost |

---

## Security Checklist

### Website
- [ ] HTTPS only (automatic)
- [ ] Security headers (Vercel handles most)
- [ ] Form input validation
- [ ] CSRF protection
- [ ] Rate limiting on contact form
- [ ] No secrets in client code
- [ ] Environment variables for keys
- [ ] Dependency scanning (Dependabot)

### Personal Finance
- [ ] Authentication required
- [ ] Row-level security on database
- [ ] Encryption in transit (HTTPS)
- [ ] No full account numbers stored (last 4 only)
- [ ] No passwords/credentials stored
- [ ] Audit logging (optional)
- [ ] Regular backups
- [ ] Export/delete functionality

---

## When to Upgrade / Add

**Don't add now:**
- Database migrations system (use Supabase dashboard)
- CMS (content in git/markdown)
- Admin panel (just edit files)
- Testing framework (add if needed)
- Build optimizations (Vercel handles most)
- Monitoring (add if issues arise)

**Add only if needed:**
- Blog platform (if you're writing)
- Payment processing (if selling)
- Complex state management (if app grows)
- Mobile app (if demand exists)
- APIs for others (if you want them)

---

## Documentation

### Code Documentation

Minimal but helpful:
- Comments for "why", not "what"
- README.md in repo
- API route documentation (what endpoints do)

### Personal Knowledge

Keep notes on:
- Why you chose certain tech
- Known limitations
- Future improvements
- Setup instructions

---

## Final Notes

**This tech stack is intentionally boring.** That's good. It means:
- Fast to develop
- Easy to maintain
- Familiar to you
- No learning curve distractions
- Focus on content and design, not tooling

The website should demonstrate your quality through:
- Thoughtful design
- Case studies that show your thinking
- Accessible, fast experience
- Not through fancy tech

The finance app should demonstrate your quality through:
- Correct calculations
- Thoughtful UX
- Useful insights
- Not through shiny features

Keep it simple. Ship it.
