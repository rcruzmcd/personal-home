# UX Patterns

Interaction/layout conventions for both apps — `finance-os` app screens and the
`personal-home` site. `BRAND_GUIDE.md` covers *what things look like* and
`STYLE_SYSTEM.md` *how that's wired into Tailwind*; this doc covers **where
things go on the page** — heading, actions, filters, sorting and pagination —
and **what a screen shows while it loads, when it's empty and when it fails**,
so every screen is laid out the same way and the decisions don't get
re-litigated per page.

Rules 1, 2, 2a, 7, 8 and 9–12 are general and hold in both apps; 3–6 are list-screen
rules and only bite where there are filters, sorting or pagination (today, only
`finance-os`). See "Applying this to `personal-home`" at the end for what the
marketing site does with them.

These rules are applied across every `finance-os` `(app)` screen and every
`personal-home` page. Shared components carry them, so a new page gets the
layout by using them rather than by re-deriving it:

| Component | File (`finance-os`) | File (`personal-home`) | Use for |
|---|---|---|---|
| `PageHeader` | `src/components/page-header.tsx` | `src/components/content/page-header.tsx` | Every screen's top: breadcrumb → title → description, with `stats` and `actions` slots on the opposite end of the title row. `compact` drops the title to h2. The `personal-home` version also renders the brand accent bar above the title and takes an `eyebrow` slot (status/tech badges). |
| `Stat` | `src/components/ui/stat.tsx` | `src/components/ui/stat.tsx` | A labelled headline number (label above value). `tone`: `neutral` / `positive` / `accent` / `danger` (finance-os only, for an exceeded limit); `personal-home` adds `size: sm` for in-body grids. |
| `Breadcrumb` | `src/components/ui/breadcrumb.tsx` | `src/components/ui/breadcrumb.tsx` | The trail itself; reached through `PageHeader`'s `breadcrumb` prop. `personal-home`'s is the shadcn/ui breadcrumb restyled onto the brand tokens. |
| `FormPage` | `src/components/form-page.tsx` | — | The single-form add/edit screens — compact header + breadcrumb above a `max-w-lg` card. |
| `MonthNav` | `src/components/month-nav.tsx` | — | Prev / month / next / Today for any month-scoped screen (`/calendar`, `/budgets`). Takes an `href` builder so only the URL is route-specific, and a `trailing` slot for anything that describes rather than filters (the calendar's legend). Month state lives in the URL via `src/lib/month-params.ts`, so a month is bookmarkable. |
| `Skeleton` + skeletons | `src/components/ui/skeleton.tsx`, `src/components/skeletons.tsx` | — | A route's `loading.tsx` (rule 9). `PageHeaderSkeleton`, `StatCardGridSkeleton`, `ListCardsSkeleton`, `FormCardSkeleton` mirror the real components, so a skeleton is assembled, not drawn. |
| `Spinner` / `LoadingOverlay` | `src/components/ui/spinner.tsx`, `src/components/loading-overlay.tsx` | — | A mutation in flight (rule 10): the overlay dims and blocks the form that triggered it, with a purple spinner and `role="status"`. |

---

## The list-screen layout

```
Transactions  ›  Chase Checking                         ← breadcrumb
Chase Checking            Current balance   Jul 2026 net   [Import] [Add]
Chase · checking            $4,182.55        −$1,204.00
─────────────────────────────────────────────────────────────────────────
All years  2026                                         ← year pills (only if >1 year)
All 2026  May 28  Jun 38 [Jul 39] Aug 40  Sep 12        ← month tabs
[🔍 Search descriptions        ]           Date ▾  ↓ Newest first
─────────────────────────────────────────────────────────────────────────
☐ Select all on this page
…rows…
157 transactions · page 1 of 4          10 / page ▾  [Previous] [Next]
```

### 1. Breadcrumb above the title, never a back link below it

A trail belongs between the global nav and the page heading. Placed *under* an
`h1`, a "Back to X" link reads as the page's subtitle and loses its meaning as
navigation. The current page is the last node and is not a link
([NN/g, *Breadcrumbs*](https://www.nngroup.com/articles/breadcrumbs/)).

### 2. The header carries the page's key numbers and its primary actions

A screen should answer "what am I looking at, and how is it doing?" before the
user scrolls. Headline figures sit at the top right as `Stat`s, with the page's
actions to their right. An empty header band is wasted above-the-fold space.

Where the numbers came from, per screen: Accounts → net worth; an account →
balance + entry status; an account's transactions → balance + net for the
selected period; Income → expected income this calendar month; Recurring →
monthly obligations; Debt → total debt + minimum payments.

Two limits on this:

- **A stat in the header must not also be a row in the body.** The Debt page's
  total and minimum payments moved out of the "By category" card; the account
  detail page's balance and status moved out of their cards; Recurring's
  monthly-total card became a header stat and the card was deleted.
- **The Dashboard has no header stats at all** — its body *is* the headline
  figures, so a header stat would state each number twice.

Totals that describe a whole filtered set (not just the visible page) must be
aggregated in the database — see the `transaction_totals` RPC. Summing the
fetched rows would be wrong on page 2 and silently truncated by PostgREST's
row cap.

### 2a. One primary action per header, and it goes last

Header actions are right-aligned with the primary button furthest right and
secondary ones to its left (`[Import] [Add transaction]`). Never two primaries
in one header, and never a primary in the header competing with a primary in
the body ([Carbon](https://carbondesignsystem.com/components/button/usage/),
[Helios](https://helios.hashicorp.design/patterns/button-organization)).

### 3. Filtering in one band; sorting pushed away from it

Filtering changes *which* rows are in the set; sorting changes only their
order. Users conflate the two when they're stacked in one undifferentiated
column of controls, so filters (timeframe + search) are concentrated in a
single band above the list and sorting is right-aligned at the far end of it
([NN/g, *Filters and Sorting*](https://www.nngroup.com/contents/self-paced-courses/filters-and-sorting-the-complete-design-guide/);
[Baymard, *Applied Filters*](https://baymard.com/blog/how-to-design-applied-filters)).

Ordering within the band: broad → narrow, i.e. timeframe (year pills → month
tabs) before free-text search.

### 4. Pagination controls stay with the pager

Page size is a pagination control, not a filter. It lives in the footer beside
Previous/Next, not in the toolbar at the top — splitting the two put closely
related controls at opposite ends of the page.

### 5. Don't render a control that carries no information

The year pills are hidden when the account only has one year of data (every
count would equal "All years"), and its months become the only timeframe axis.
The same test applies to any filter row: if every option leads to the same set,
it's chrome, not navigation.

### 6. Say each count once

Before this pass, "157" appeared in the *All years* pill, the *2026* pill and
the footer. Counts belong either on the control that filters to them (a month
tab) or in the result summary — not both.

### 7. Form screens are pages, not floating cards

The add/edit screens used to be a bare card with its title inside `CardHeader`
and no way back except the browser's Back button. They now use `FormPage`: a
breadcrumb and an `h1` above the card, the card holding only the fields. The
trail is both the location cue and the escape route — and the existing
`UnsavedChangesDialog` guards leaving through it
([NN/g, *Reset and Cancel Buttons*](https://www.nngroup.com/articles/reset-and-cancel-buttons/)).

The title drops to `text-h2` (`compact`) on these screens: a 48px heading over
a 512px-wide form outweighs the form it introduces.

### 8. Breadcrumb labels are the destination's own title

`Transactions › Categorization Rules`, not `Transactions › Rules` — a node has
to read as the page it leads to. Nodes are always links except the current
page, and the trail is `text-small text-muted` so it never competes with the
title or the primary action.


---

## Loading, empty and error states

Every screen has four states, not one: loading, empty, failed and loaded. The
mockups and specs only draw the last, so these rules fill in the other three.
They're written so the same component can serve every screen.

### 9. Pages load as a skeleton of themselves, not a spinner

Each route gets a `loading.tsx` built from the skeleton pieces of the
components the page actually renders: `PageHeaderSkeleton` with the same
number of actions, the same card grid, the same column of list rows. The real
page then replaces it without the layout shifting. A skeleton shows the
shape of what's coming, so the wait feels shorter than a blank page with a
spinner ([NN/g, *Skeleton Screens*](https://www.nngroup.com/articles/skeleton-screens/)).

- **The shell is not part of the skeleton.** Nav, footer, breadcrumb and the
  page title (when it's known without a fetch) render for real; only the data
  regions are placeholders.
- **Blocks, not fake text.** Grey bars at the height of the line they replace,
  `bg-border` fill, `rounded-md`, `motion-safe:animate-pulse` so the pulse
  stops under `prefers-reduced-motion`.
- **Announce it once.** The skeleton's wrapper takes `aria-busy="true"` and an
  `sr-only` `role="status"` line ("Loading transactions"); the bars themselves
  are `aria-hidden`.
- **A spinner alone is for spaces too small for a skeleton:** a button, an
  overlay, a single inline value. Never a full-page spinner.

### 10. A change shows progress where it was made

When the user submits, the control they pressed answers:

- **The button changes its label and disables:** `Save` → `Saving…`,
  `Send` → `Sending…`, `Delete` → `Deleting…`. Present-continuous verb of the
  button's own label, with an ellipsis. Disabling it is what stops double
  submits; the label is what tells the user why.
- **A form that does real work** (a server round trip) also gets
  `LoadingOverlay` over the form, not over the page. The rest of the screen
  stays usable.
- **Success is the result, not a message.** A save redirects to the page that
  shows the saved thing, or updates the row in place. No toast for routine
  saves; a toast that says "Saved" next to the saved value says it twice
  (rule 6's logic). Use a confirmation message only when the outcome isn't
  visible on screen ("Invitation sent to ana@example.com").
- **Under a second, nothing else.** Don't add a delay-only spinner to make a
  fast action feel substantial. Past ~10 seconds (an import, a payoff
  simulation), say what's happening and roughly how long it takes
  ([NN/g, *Response Times*](https://www.nngroup.com/articles/response-times-3-important-limits/)).

### 11. Empty states say what's missing and name the way out

"No accounts yet." on its own is a dead end. An empty state has:

1. **What would be here**, in the page's own words: `text-body text-muted`.
   One sentence.
2. **The action that fills it**: the page's primary action as a button, or a
   link to where it can be done. If the header already carries that action
   (rule 2a), repeat it in the body: the empty body is where the eye lands.
3. **No list chrome.** No column headers, select-all, pager or sort control
   over zero rows (rule 5).

Two variants:

- **Nothing matches the filter** is not the same as nothing exists. Say so
  ("No transactions in June 2026 match “rent”") and offer to clear the
  filter, not to create a record.
- **The viewer can't fill it.** When someone else creates the content (a
  client waiting on a consultant, a visitor on an unpublished listing), say
  who will and, if known, when, then link to what *is* available. Never offer
  an action the viewer isn't allowed to take.

### 12. Errors say what happened and what to do next, at the scope they happened

| Scope | Where | How |
|---|---|---|
| A field | Under the field | `text-small font-medium text-purple`, linked by `aria-describedby`, field gets `aria-invalid`. Shown on submit, then live as the user fixes it. |
| A form | Above the submit button | `role="alert"`, same text style. The server's reason in plain language ("That email already has an account"), never the raw error or a code. Fields keep what the user typed. |
| A route | `error.tsx`, inside `PageShell` | The page's own header with "This page didn't load" and one sentence; then **Try again** (primary, calls `reset`) and a way out (secondary: back to the parent page or home). Show `error.digest` in `text-small text-muted` as a reference to quote. |
| Not found | `not-found.tsx` | Same shape as a route error, but say the thing doesn't exist or was moved, and link to its listing. Never "something went wrong" for a 404. |

- **Errors are purple, not red.** Deep Purple is the brand's warning colour
  (BRAND_GUIDE §10) and `--color-red` is reserved for over-limit and
  destructive actions (`STYLE_SYSTEM.md`). Red on every validation message
  would wear that meaning out.
- **Keep the frame.** A failed region inside a working page fails alone (its
  own boundary or inline message); one failed fetch never blanks the nav.
- **Copy:** say what didn't happen and what to do, in the second person, no
  blame: "We couldn't save your changes. Check your connection and try
  again.", not "Error 500" or "Invalid input".

---

## Applying this to `personal-home`

The site has no filtered lists, so rules 3–6 have nothing to act on yet. What
the general rules produced:

- **Every page goes through `PageHeader`.** Home, About, Work, Projects,
  Consulting, Resume, Contact, Privacy, Terms and the two project detail
  templates previously repeated `AccentBar → h1 → paragraph` by hand, which is
  how the Resume page ended up with its own bespoke title/button row. The
  header now owns that markup, so the accent bar, title scale and description
  width can't drift page to page.
- **Every page goes through `PageShell`** (`src/components/site/page-shell.tsx`),
  whose max-width and gutters are the header's and the footer's (`max-w-5xl`).
  Pages used to set their own — 5xl on Home/Work/Projects/Consulting, 3xl on
  About/Resume/the legal pages/the case studies, 2xl on Contact — so the narrow
  ones sat visibly inset from the nav above them. A wider shell is not wider
  text: long-form copy sets its own reading measure with `Prose` (the 3xl it
  already had), and the Contact form keeps its own column, so body copy never
  runs the full 1024px. Card grids, stat rows and button rows use the shell's
  full width.
- **Case study and project pages carry a breadcrumb** (`Work › Chatter Snow`,
  `Projects › Personal Finance OS`) where they previously offered no way back
  to the listing at all. The node label is the destination's own page title
  (rule 8), and the detail page's status and tech badges sit in the header's
  `eyebrow` slot above the title.
- **Resume's Download PDF button is a header action** (rule 2a) — the only
  header action on the site. Consulting deliberately has none: its one primary
  action, "Start a conversation", is at the foot of the body, and a second
  primary in the header would compete with it.
- **Case study metrics use `Stat`** but stay in the body (`size="sm"`) rather
  than moving into the header. On a narrative page a metric is evidence inside
  the argument, not the page's status — and rule 2 forbids saying the same
  figure in both places.
- **The homepage is the site's Dashboard exception** (rule 2): its hero *is*
  the headline content, so it takes no header stats, and its two CTAs stack
  below the copy rather than being pulled into a right-aligned action cluster.
- **Empty states name the way out.** The Work and Projects listings used to end
  at "No case studies published yet."; each now pairs that with the links that
  fix it (the other listing, plus Contact).

Not done: the marketing site keeps `text-h1` (48px) everywhere, including the
Contact form page. The "form screens are compact" part of rule 7 is an app-screen
rule — on a marketing page the 48px heading is the brand voice, not chrome.

## Open items

- **H1 scale on app screens.** `text-h1` (48px) is a marketing-site size; on a
  dense app screen it competes with the data. Every app page uses it today, so
  downscaling is an app-wide change (and a `STYLE_SYSTEM.md` amendment), not a
  per-page one — deliberately not done here.
- **Sticky filter band.** For long lists, `sticky top-0` on the filter band
  keeps the timeframe and search reachable while scrolling. Worth adding once
  page sizes above 50 exist.
- **Applied-filter chips.** When more filter dimensions land (category, type,
  amount range), show the active set as removable chips below the band rather
  than growing the stack of controls.
- **Explicit Cancel on forms.** Only `transaction-form` has one; the rest rely
  on the breadcrumb. Worth making uniform — a Cancel beside Save is a more
  obvious exit than a trail node.
- **Empty states (rule 11).** Several `finance-os` screens answer with a bare
  sentence ("No income sources yet.", "No accounts yet."). Each should pair
  that with the action that fixes it, the way the Dashboard and Forecast empty
  states already do.
- **`finance-os` drift from rules 9 and 12.** `Skeleton` fills with `bg-muted`
  (the muted *text* colour, so the bars are dark grey) and pulses regardless of
  reduced motion; switch to `bg-border motion-safe:animate-pulse`. Form errors
  render in the green `callout` Alert, which reads as success; they should be
  purple text with `role="alert"`. No route has an `error.tsx` yet.
- **Shared state components.** `Skeleton`, `Spinner`, `LoadingOverlay` and an
  `EmptyState` (message + action slot) belong in the `@rickie` registry so
  `client-portal` installs them instead of re-deriving rules 9–12.
