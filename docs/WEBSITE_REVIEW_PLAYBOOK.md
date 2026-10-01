# Website Review Playbook

A repeatable process for auditing an external website — IA, UX/UI, security,
legal, accessibility, SEO, performance, mobile and tracking. Written after the
Suitcases of Hope review (2026-09), where a static-source-only pass produced
four findings that turned out to be wrong once the site was actually rendered.

This doc is about *reviewing someone else's site*. For conventions inside this
monorepo see `UX_PATTERNS.md`, `BRAND_GUIDE.md` and `STYLE_SYSTEM.md`.

---

## The one rule

**A finding from page source is a hypothesis. A finding from a rendered page is
a fact.** Run the static pass first because it is cheap and it tells you where
to look, but do not report its output as conclusions. Every claim about
contrast, focus, layout, tracking or form behaviour needs the browser.

In the Suitcases of Hope review the static pass was wrong about: page titles
(assumed duplicated, actually unique), Wix skip landmarks (assumed leaking into
content, actually visually hidden and intentional), Facebook Pixel (assumed
active from an `fb:admins` tag, no pixel fires at all), and image weight
(assumed oversized, Lighthouse says correctly sized). It was also *silent*
about the three real contrast failures and the missing focus ring.

---

## Setup

Everything runs locally against the installed Chrome. Work in a scratchpad
directory, not the repo.

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
npm init -y && npm i puppeteer-core pngjs   # driving + pixel reads
npx -y lighthouse@latest --version          # audits, no global install
```

Gotchas worth knowing up front:

| Gotcha | Workaround |
|---|---|
| macOS has no `timeout` binary | Let puppeteer's own `timeout` option handle it, or `gtimeout` from coreutils |
| PageSpeed Insights API is quota-limited and fails without a key | Run Lighthouse locally instead — same engine, no quota |
| `--headless` screenshots use a desktop UA | Set a mobile UA *and* `isMobile`/`hasTouch` in `setViewport`, or platforms serve you the desktop layout |
| Programmatic `.focus()` does not reliably match `:focus-visible` | Drive real `page.keyboard.press('Tab')` |
| Site builders (Wix, Squarespace) serve a fixed small layout viewport | Check `document.documentElement.scrollWidth` vs `window.innerWidth`, not the screenshot width |

---

## Phase 1 — static pass

One `curl` per page into a local file, then parse. Cheap, and it gives you the
target list for phase 2.

```bash
for p in "" about contact …; do
  curl -sA "Mozilla/5.0 … Chrome/140.0 Safari/537.36" "https://site/$p" -o "${p:-home}.html"
done
curl -s -o /dev/null -w "%{http_code}\n" https://site/sitemap.xml
curl -s https://site/robots.txt
```

Extract per page: `<title>`, `meta[name=description]`, `meta[name=robots]`,
`og:*`, `link[rel=canonical]`, and every `application/ld+json` block.

Check:

- [ ] `robots` — is `noindex` set anywhere it shouldn't be?
- [ ] Titles and descriptions unique per page, or defaulting?
- [ ] Canonicals present and distinct?
- [ ] `sitemap.xml` actually served (a `robots.txt` reference is not proof)?
- [ ] JSON-LD present, and is it the *right* type (`Organization`/`NGO`/
      `LocalBusiness`, not just `WebSite`)?
- [ ] Security headers: HSTS, `X-Content-Type-Options`, CSP.

---

## Phase 2 — live pass

One puppeteer script, every page × every viewport, collecting in a single
`page.evaluate`. Viewports: `390×844` and `360×760` with a mobile UA and
`isMobile: true`, plus `1280×900` desktop.

### 2.1 Layout and overflow

Per page and viewport, record `document.documentElement.scrollWidth` against
`window.innerWidth`, and list elements whose bounding rect extends past the
viewport. Take a `fullPage` screenshot of each.

- [ ] No horizontal scroll at any width
- [ ] Nav collapses to a usable menu — *open it* and screenshot the open state
- [ ] Grids and stat blocks reflow without overlap
- [ ] Forms usable: fields visible, buttons reachable

### 2.2 Contrast — measure pixels, don't guess

Computed styles alone can't resolve text over an image or a gradient. Sample
the rendered screenshot instead:

1. Collect every leaf text element with its `color`, `fontSize`, `fontWeight`
   and page-absolute bounding box.
2. Screenshot `fullPage`, then for each element sample the pixel ring just
   above and below its box and take the modal colour as the background.
3. Compute the WCAG ratio. Threshold is 3:1 for large text (≥24px, or ≥18.66px
   at weight ≥700) and 4.5:1 otherwise.

Cross-check against Lighthouse's `color-contrast` audit. Where they agree you
have a solid finding; where only your sampler flags something, verify it in a
screenshot crop before reporting.

**Report the passes too.** "The stat block measures 4.26:1 and passes" closes an
open question and is as useful as a failure.

### 2.3 Keyboard and focus

Drive real Tab presses and read `document.activeElement` after each:

- [ ] A skip link exists and is the first stop
- [ ] Every interactive element is reachable
- [ ] Each has a visible indicator — `outlineStyle !== 'none'` **or** a
      `boxShadow`. Record both; builders often use an inset box-shadow.
- [ ] Dropdowns open on Enter and their items become reachable
- [ ] Nothing is trapped; check iframes, which are their own tab scope

### 2.4 Semantics

From the DOM, not the source:

- [ ] Headings are real `<h1>`–`<h6>`. Check *order* as well as existence —
      exactly one `<h1>`, no `<h2>` before it.
- [ ] Form fields have a real `<label for>`, wrapping `<label>`, `aria-label`
      or `aria-labelledby` — resolve each and record which
- [ ] `alt` text is descriptive, not a leftover filename (`_edited.jpg`) and
      not empty on meaningful images
- [ ] `<main>`, `<nav>` landmarks present; `<html lang>` set

### 2.5 Performance

Lighthouse locally, mobile and desktop, on the heaviest page at minimum:

```bash
CHROME_PATH="$CHROME" npx -y lighthouse@latest https://site/ \
  --output=json --output-path=./lh-mobile.json --quiet \
  --chrome-flags="--headless=new --no-sandbox"
# add --preset=desktop for the desktop run
```

Report score, FCP, LCP, TBT, CLS, TTI for both. Then read the failing audits
to find the *cause* — `image-size-responsive` passing while `unused-javascript`
is 163 KB tells a completely different story from the reverse.

Run `--only-categories=accessibility,seo` across the remaining pages; it's fast
and confirms whether a finding is site-wide or page-specific.

### 2.6 Tracking and cookies

Attach a `request` listener, collect every non-first-party hostname, and read
cookies after load.

- [ ] Inventory each third-party host and what it is
- [ ] Note which set cookies and whether they're first- or third-party
- [ ] **Verify tags actually fire.** A meta tag or snippet in the source is not
      evidence of an active tracker.

### 2.7 Forms

**Do not submit test entries to a real inbox.** Verify client-side behaviour
only, and say in the report that you did so.

- [ ] Click submit on an empty form; confirm validation blocks it and no
      success state fires
- [ ] Watch `pageerror` and `console` for errors
- [ ] Check whether any CAPTCHA loads — absence is a real finding
- [ ] Check which fields are `required`, especially consent checkboxes. A
      required marketing opt-in is a legal problem, not just a UX one.

---

## Phase 3 — legal and trust

Mostly reading, but verify each claim against the rendered page:

- [ ] Privacy policy exists and covers what the tracking inventory found
- [ ] Terms exist if any form asks users to accept them
- [ ] Cookie notice matches the actual cookies set
- [ ] Organisation identifiers present (registration number, copyright line,
      third-party verification seals) — and check they render on **mobile**,
      not just desktop
- [ ] Payment handled by a compliant processor, not the site itself

---

## Reporting

Status every item so a reader knows what was tested:

| Status | Meaning |
|---|---|
| Confirmed | Reproduced on the live site |
| Revised | The earlier reading was wrong; say what's actually true |
| New | Found during verification, not in the original review |
| Open | Not yet verified — say why |

Conventions that held up well:

- State the **method and its limits** at the top — tools, viewports, and what
  you deliberately did not do.
- Give **numbers, not adjectives**: "1.86:1, needs 4.5:1" beats "low contrast".
- **Strike through retractions rather than deleting them**, so anyone tracking
  the list sees the change instead of silently losing an item.
- Lead a corrected section with the correction, not with the original claim.
- When editing a shared doc, watch for **comment anchors**: rewriting a block
  wholesale detaches its thread. Use targeted text replacement on those blocks.
- Group the fix list by priority and keep it the single source of truth; every
  section below it should map to a row.
