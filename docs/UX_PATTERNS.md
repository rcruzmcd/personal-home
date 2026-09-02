# UX Patterns

Interaction/layout conventions for `finance-os` app screens. `BRAND_GUIDE.md`
covers *what things look like* and `STYLE_SYSTEM.md` *how that's wired into
Tailwind*; this doc covers **where things go on the page** — heading, actions,
filters, sorting and pagination — so every list screen is laid out the same way
and the decisions don't get re-litigated per page.

These rules are applied across every `(app)` screen. Three shared components
carry them, so a new page gets the layout by using them rather than by
re-deriving it:

| Component | File | Use for |
|---|---|---|
| `PageHeader` | `src/components/page-header.tsx` | Every screen's top: breadcrumb → title → description, with `stats` and `actions` slots on the opposite end of the title row. `compact` drops the title to h2. |
| `Stat` | `src/components/ui/stat.tsx` | A labelled headline number (label above value). `tone`: `neutral` / `positive` / `accent`. |
| `Breadcrumb` | `src/components/ui/breadcrumb.tsx` | The trail itself; usually reached through `PageHeader`'s `breadcrumb` prop. |
| `FormPage` | `src/components/form-page.tsx` | The single-form add/edit screens — compact header + breadcrumb above a `max-w-lg` card. |

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
- **Empty states.** Several screens answer with a bare sentence ("No income
  sources yet."). Each should pair that with the action that fixes it, the way
  the Dashboard and Forecast empty states already do.
