# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

This repo is **public** and has two top-level parts. Two sibling apps live in their
own **private** repos so personal and client data can't leak here:
`rcruzmcd/finance-os` (Personal Finance OS) and `rcruzmcd/client-portal`. Both reuse
this repo's brand and layout docs.

- **`docs/`** — Planning and requirements documents for the project (not application code). These describe the *intended* product, not what's currently implemented:
  - `PROJECT_OVERVIEW.md` — goals, positioning, MVP scope for the personal site
  - `TECH_STACK_AND_DOMAIN.md` — chosen/recommended tech stack for both the website and the "Personal Finance OS" app, hosting, domain/email setup
  - `WEBSITE_REQUIREMENTS.md` — site architecture (routes), page-by-page content requirements, SEO/analytics/accessibility targets
  - `CONTENT_SCHEMA.md` — the `Project` content schema for case studies/portfolio entries (MDX with frontmatter under a planned `content/work/` and `content/projects/` structure), plus SEO metadata patterns
  - `CASE_STUDIES.md` — case study template and drafted content for two case studies (Chatter Snow, Personal Finance OS)
  - `TIMELINE.md` — week-by-week build/launch plan
  - `QUICK_START.md` — pre-launch checklist and week-by-week setup summary for both projects
  - `BRAND_GUIDE.md` — brand identity reference (color palette, typography, usage rules) for rickiecruz.com; a living doc updated as the brand evolves. Sections 14–15 cover the *other* brands the site carries: Coven (the product — Indigo + Amber, its own identity, never "by Rickie" in the lockup) and how a sibling organization's palette is worn by its project card without colliding with this site's purple
  - `UX_PATTERNS.md` — where things go on a page in **every** app (this site, finance-os, client-portal): breadcrumb/heading order, header stats and actions, filter vs. sort placement, pagination, empty states; check it before laying out a new page. The apps have a `PageHeader`/`Breadcrumb`/`Stat` trio that carries these rules — use them instead of hand-rolling a page's title block
  - `WEBSITE_REVIEW_PLAYBOOK.md` — repeatable process for auditing an *external* site (IA, a11y, SEO, performance, mobile, tracking, legal). Not about this monorepo; use it when reviewing someone else's website. Its core rule: static page source gives hypotheses, only a rendered browser pass gives findings
  - The client portal's requirements live in the private `rcruzmcd/client-portal` repo, not here: this repo is public, and they carry client engagement detail. Keep client names, prices and findings out of this repo

  Keep your replies extremely concise and focus on conveying the key information. No unnecessary fluff, no long code snippets.

  Follow SOLID principles when developing.

  When implementing a feature, check the relevant doc first — these encode real product decisions (e.g. avoid positioning as "web developer"/"React developer" in copy).

- **`personal-home/`** — The actual Next.js application (the personal portfolio site). The MVP described in `docs/` has been built out: homepage, About, Work/Projects listings + MDX case study detail pages (Chatter Snow, Personal Finance OS), Consulting, Resume, Contact (with API route, spam protection, Resend email), Privacy/Terms, dark/light mode, SEO metadata/JSON-LD/sitemap/robots, and Vercel Analytics event tracking.

The Personal Finance OS app that used to live in `finance-os/` is now the private
`rcruzmcd/finance-os` repo (history included), along with its spec
(`PERSONAL_FINANCE_REQUIREMENTS.md`) and the local-only `PAYCHECK_PLANNER.md`. Its
showcase still runs at `finance.rickiecruz.com`, and this site's case study links
there.

## Commands

App commands run from `personal-home/`. It uses **bun** (`packageManager: bun@1.3.14`) — use `bun`, not `npm`/`yarn`/`pnpm`.

```bash
cd personal-home
bun install        # install dependencies
bun dev             # start dev server (next dev)
bun run build       # production build (next build)
bun start           # run production build (next start)
bun run lint        # eslint
```

Use `bun run test`, **not** `bun test` — the latter invokes bun's own test runner,
which doesn't read `vitest.config.mts` and fails on the jsdom-dependent component
tests.

```bash
cd personal-home
bun run test          # vitest run
bun run test:watch    # vitest (watch mode)
bun run test:coverage # vitest run --coverage
```

## Architecture Notes (`personal-home/`)

- **Next.js 16 (canary-ish, App Router)** with **React 19** and **`reactCompiler: true`** enabled in `next.config.ts` — the React Compiler is on, so avoid manual `useMemo`/`useCallback` micro-optimizations unless needed for correctness.
- **TypeScript**, strict mode, path alias `@/*` → `./src/*`.
- **Tailwind CSS v4** via `@tailwindcss/postcss` (no `tailwind.config.js` — v4 is CSS-first; check `src/app/globals.css` for theme tokens).
- App Router structure: every renderable route sits under `src/app/[locale]/` — the root layout is `src/app/[locale]/layout.tsx` and the homepage is `src/app/[locale]/page.tsx`. See Internationalization below for why.
- **Read `node_modules/next/dist/docs/` before writing Next.js code.** This Next.js version has breaking changes relative to older training data/conventions — `personal-home/AGENTS.md` (auto-generated by `next dev`) flags this explicitly. Don't assume Pages Router or older App Router APIs are current.
- `personal-home/CLAUDE.md` (`@AGENTS.md`) and `personal-home/AGENTS.md` are auto-generated/rewritten by `next dev` — don't hand-edit them; edits will be overwritten.

### Internationalization (`personal-home/`)

The site ships in English and Spanish. **English is unprefixed** (`/about`), every other
locale is prefixed (`/es/about`), and `/en/*` permanently redirects to the unprefixed
path so each page has exactly one public URL. Route slugs stay English in both locales.

- Every renderable route lives under `src/app/[locale]/`. `sitemap.ts`, `robots.ts`,
  `apple-icon.tsx`, and `api/` stay at `src/app/` — they need no layout.
- `src/proxy.ts` maps public URLs onto that shape. **Next 16 renamed `middleware` to
  `proxy`** — don't reintroduce a `middleware.ts`. The proxy is a thin adapter over
  `resolveLocaleRoute` in `src/lib/i18n/routing.ts`, which holds the whole policy as a
  pure function so it can be unit-tested without Next requests. Put routing rules there,
  not in the proxy.
- Server Components read the locale with `import { locale } from "next/root-params"` —
  no prop drilling. It is **unavailable in Client Components, Server Actions and Route
  Handlers**: client components use `useMessages()`/`useLocale()` from
  `@/components/i18n/i18n-provider`, and the contact API takes the locale as a field on
  the request body.
- Strings live in `src/lib/i18n/dictionaries/{en,es}.ts`. `es` is typed as
  `Dictionary` (= `typeof en`), so **a missing or misspelled key is a build failure**,
  not a runtime fallback. Deliberately not `as const` — literal types there would force
  both locales to hold identical strings. Only the `client` namespace is sent to the
  browser; keep long-form page prose out of it.
- Use `<LocaleLink href="/work">` (not `next/link`) for internal links — it applies the
  prefix. `href` is always the locale-independent path.
- `formatDate(iso, locale)` takes a required locale. `buildAlternates(path, locale)` in
  `src/lib/seo.ts` produces canonical + `hreflang` (including `x-default`); every page's
  `generateMetadata` should call it.
- **Case-study translations are overlays, not copies.** English `index.mdx` is canonical
  and holds every field; `index.es.mdx` holds only the language-dependent ones. Ids,
  slugs, dates, technologies, images and link URLs exist once, so they can't drift.
  A missing translation falls back to English behind a notice, canonicalizes to the
  English URL, and is left out of the Spanish sitemap entries.
  `src/lib/content/__tests__/translations.test.ts` guards structural parity.
- **Watch for YAML colons in Spanish list items.** A bare scalar containing `": "` parses
  as a map, not a string — quote those entries.
- Adding a locale: add it to `LOCALES` in `src/lib/i18n/locales.ts`, add its dictionary,
  and add `index.<locale>.mdx` overlays. Routing, sitemap and hreflang derive from
  `LOCALES` and need no edits.

## Docs vs. reality

The site is built and in production. The `docs/` folder describes the *intended*
product and predates much of the implementation, so where a doc and the code disagree,
the code is current. Finance-specific docs (`TECH_STACK_AND_DOMAIN.md`'s Personal
Finance sections, `TIMELINE.md`, `QUICK_START.md`) are historical here; the finance
spec now lives in the `finance-os` repo.

`docs/STYLE_SYSTEM.md` is the implementation reference for `docs/BRAND_GUIDE.md` — check it before hand-picking colors/spacing for new UI; a couple of brand-guide literal values (muted text) were adjusted during implementation for WCAG AA contrast and both docs now reflect the shipped values.
