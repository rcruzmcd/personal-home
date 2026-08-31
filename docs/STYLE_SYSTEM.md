# Style System

Implementation reference for translating `docs/BRAND_GUIDE.md` into code in
`personal-home/`. The brand guide is the source of truth for *design intent*;
this doc is the source of truth for *how it's wired into Tailwind v4* and the
class recipes to use while building pages.

Tokens live in `personal-home/src/app/globals.css` (Tailwind v4 `@theme`,
CSS-first — no `tailwind.config.js`). Fonts are loaded in
`personal-home/src/app/layout.tsx` via `next/font/google`.

---

## Color tokens

Defined as CSS variables on `:root`, re-exposed as Tailwind theme colors so
`bg-*`, `text-*`, `border-*`, `ring-*` all work directly (including opacity
modifiers, e.g. `bg-purple/10`).

| Token | Utility prefix | Light | Dark | Brand guide name |
|---|---|---|---|---|
| `--color-background` | `bg-background` | `#F4F6F9` | `#0F1117` | Cool Silver (page canvas) |
| `--color-surface` | `bg-surface` | `#FFFFFF` | `#1C1F26` | Surface (cards) |
| `--color-border` | `border-border` | `#E0E3E8` | `#2D3139` | Divider Gray |
| `--color-muted` | `text-muted` | `#9BA3AF` | `#6B7280` | Muted Text |
| `--color-foreground` | `text-foreground` | `#2C3E50` | `#E0E3E8` | Strong Text |
| `--color-purple` | `bg-purple` / `text-purple` | `#5D3A7A` | `#9B7AC9` | Deep Purple (primary) |
| `--color-green` | `bg-green` / `text-green` | `#2D7A4A` | `#5FB876` | Rich Green (secondary) |

**Never** use raw `white`/`black`/arbitrary hex in components — always the
token names above, so dark mode "just works" once the toggle exists.

### Dark mode

Currently automatic via `prefers-color-scheme`. When the manual toggle
(planned) ships, it should:

1. Set `data-theme="dark"` or `data-theme="light"` on `<html>`.
2. Persist the choice to `localStorage`.
3. On load, read `localStorage` and set the attribute before paint (to avoid
   flash) — no changes needed in `globals.css`, the selectors already handle
   both the attribute and the media-query fallback.

## Typography

Custom `text-*` size utilities generate the exact px/line-height pairs from
the brand guide. Font family utilities: `font-sans` (Inter, default body),
`font-serif` (Merriweather — case-study pull quotes only, used sparingly),
`font-mono` (Geist Mono — code snippets).

| Element | Class recipe | Size | Weight | Color |
|---|---|---|---|---|
| H1 | `text-h1 font-bold text-purple` | 48px / 1.2 | 700 | Purple |
| H2 | `text-h2 font-semibold text-purple` | 32px / 1.25 | 600 | Purple |
| H3 | `text-h3 font-semibold text-purple` | 24px / 1.3 | 600 | Purple |
| H4 | `text-h4 font-semibold text-foreground` | 18px / 1.4 | 600 | Strong Text |
| Body | `text-body text-foreground` | 16px / 1.6 | 400 | Strong Text |
| Small / metadata | `text-small text-muted` | 14px / 1.5 | 400 | Muted |
| Label / badge | `text-label font-medium uppercase text-green` | 12px / 1.4 | 500 | Green or Purple |
| Link (inline) | `text-body font-medium text-purple underline hover:text-[#4A2A5F] hover:italic` | 16px | 500 | Purple |

Max 2 fonts per page (per brand guide §09) — Merriweather only for a single
pull quote, never alongside body copy on the same block.

## Spacing & radius

**No custom tokens needed** — Tailwind v4's defaults already match
`BRAND_GUIDE.md` §03 exactly:

- Spacing scale (4px base unit): `gap-1`=4px, `gap-2`=8px, `gap-4`=16px,
  `gap-6`=24px, `gap-8`=32px, `gap-12`=48px, `gap-16`=64px.
- Radius: `rounded-md`=6px (badges/inputs), `rounded-lg`=8px
  (buttons/pills), `rounded-xl`=12px (cards). Never use `rounded-none`,
  `rounded-full` (unless actually pill-shaped), or anything above `rounded-xl`.

Section padding convention: `py-16 px-10` desktop → `py-12 px-6` tablet →
`py-8 px-4` mobile. Card padding: `p-6` at all breakpoints.

## Component recipes

Class strings only (no components scaffolded yet) — copy these when
building the corresponding UI.

**Primary button**
```
bg-purple text-white px-6 py-3 rounded-lg font-semibold text-body
hover:opacity-90 transition-opacity duration-200
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green
```

**Secondary button**
```
bg-background text-purple border border-border px-6 py-3 rounded-lg font-semibold text-body
hover:bg-border transition-colors duration-200
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green
```

**Tertiary / link button**
```
text-purple underline hover:italic hover:text-[#4A2A5F] transition-colors duration-200
```

**Standard card**
```
bg-surface rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300
```
(sits on `bg-background` page canvas)

**Featured card** — standard card + `border-t-[3px] border-t-purple shadow-md`

**Accent bar** (signature element, always above an h2/h3, never full-width)
```
h-1 w-12 bg-purple  {/* 40–60px wide, 3–4px tall */}
```

**Status badge**
```
bg-green text-white text-label font-medium uppercase px-3 py-1 rounded-md
```
(swap `bg-green` → `bg-purple` for a "featured" badge)

**Tech tag**
```
bg-background text-foreground border border-border text-label font-medium px-3 py-1 rounded-md
```

**Callout box** (case study key insight)
```
bg-background border-l-4 border-green p-6 text-body text-foreground
```

**Key decision box**
```
bg-surface border border-border border-l-[3px] border-l-purple p-6
```

**Form input**
```
bg-surface border border-border rounded-md px-4 py-2 text-body text-foreground
placeholder:text-muted
focus:border-purple focus:border-2 focus:ring-4 focus:ring-purple/10 focus:outline-none
```

## Do / don't (condensed from BRAND_GUIDE.md §09, §12)

- Headlines in `text-purple`, body in `text-foreground` — never pure
  `black`/`white`.
- Page background is always `bg-background` (Cool Silver), never pure white;
  `bg-surface` (white) is for cards/containers only.
- No gradients, anywhere.
- Accent bars: 40–60px wide only, never full-width.
- Shadows only on cards and their hover states, not on every element.
- Focus states always visible, always green.
- Max 5 colors visible in a single page view, max 2 fonts per page.
