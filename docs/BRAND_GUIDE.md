# Rickie Cruz Brand Guide

Professional. Intentional. Expert.

For rickiecruz.com — everything here is a living reference. Update this as the brand evolves.

**Last updated:** September 2026

---

## Brand Statement

Rickie Cruz designs and builds technology that solves real problems. The brand is professional, expert, approachable—confident but not cocky.

- **Purple** is authority and expertise
- **Green** is clarity and strategic thinking
- **Silver** is technical precision and restraint
- No gradients, no patterns, no unnecessary flourish
- Just clear, intentional work

---

## 01 — Color

### Core Palette

Five colors that work together. Each has a specific purpose.

#### Primary: Deep Purple
**Authority, Expertise, Leadership**
```
#5D3A7A
```
- Headlines (h1, h2, h3)
- Primary CTA buttons ("View my work", "Start a conversation")
- Links
- Focus states
- Top accent bars on featured content

**Usage:** Use this for anything that needs to signal expertise or primary action.

#### Secondary: Rich Green
**Clarity, Growth, Strategy**
```
#2D7A4A
```
- Secondary buttons
- Icons and accents in case studies
- Data visualization (charts, graphs)
- Hover states
- Badge labels ("active", "featured", "status")
- Supporting accent lines

**Usage:** Use this for supporting actions, secondary information, or emphasizing positive outcomes.

#### Neutral: Cool Silver
**Technical Precision, Clean Space**

**Background (page canvas)**
```
#F4F6F9
```
Very light, almost white, but with a cool undertone. Creates subtle depth without distraction.

**Surface (cards, containers)**
```
#FFFFFF
```
Pure white for cards and surfaces that sit on top of background.

**Dividers & Borders**
```
#E0E3E8
```
Soft gray for lines between sections, form input borders, subtle visual breaks.

**Secondary Text**
```
#6C717A
```
Muted gray for labels, metadata, secondary information. Darkened from the
original `#9BA3AF` during implementation — that value only hit a 2.4–2.5:1
contrast ratio against Background/Surface, short of WCAG AA's 4.5:1. This is
the nearest shade that clears AA against both.

#### Strong Text
**Primary Content**
```
#2C3E50
```
Not pure black (#000000) — slightly softer, more sophisticated.

All body copy, case study text, important information uses this color.

#### Alert Red

**Limit exceeded / destructive**
```
#B3261E   (light)
#F2857C   (dark mode)
```
Added during the budgets build (`finance-os`), which needed a way to say "you
are over this limit" that purple and green could not carry. It is a *semantic*
color, not a brand accent: use it only for an exceeded limit or a destructive
action, never decoratively, and never as the only signal — anything shown in
red also states the fact in words (WCAG 1.4.1 Use of Color).

Both values are contrast-checked the same way Secondary Text was: `#B3261E`
clears WCAG AA on Background (6.0:1) and Surface (6.5:1); the dark-mode
`#F2857C` clears it on both dark surfaces (7.6:1 and 6.6:1). `#B3261E` doubles
as the solid fill behind white text (6.5:1).

Because red is semantic, it does not count against the "max 5 colors per page"
rule the way an accent would — but if red appears on a screen with nothing
wrong on it, that is a bug in the screen, not a license to keep it.

### Color Combinations (Tested for Contrast)

**✅ Accessible combinations:**
- Deep Purple text on White background (17:1 contrast ratio)
- Deep Purple text on Cool Silver background (12:1 contrast ratio)
- Rich Green text on White background (8:1 contrast ratio)
- Strong Text on White or Silver background (12:1 ratio)
- White text on Deep Purple background (11:1 ratio)
- White text on Rich Green background (7:1 ratio)
- Alert Red text on White background (6.5:1 ratio)
- Alert Red text on Cool Silver background (6.0:1 ratio)

**❌ Don't use:**
- Rich Green on Cool Silver (insufficient contrast)
- Secondary Text for body copy (too light)
- Purple or Green backgrounds behind body text (except in small doses for callouts)

### Quick Copy-Paste Reference

```
Primary Purple:      #5D3A7A
Secondary Green:     #2D7A4A
Background:          #F4F6F9
Surface White:       #FFFFFF
Divider Gray:        #E0E3E8
Muted Text:          #6C717A
Strong Text:         #2C3E50
```

---

## 02 — Typography

### Typeface

**Primary: Inter** (or Geist)
- Modern, clean, professional
- Excellent readability on screen and in print
- Used for all body copy, headings, labels
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Optional Display: Merriweather** (serif, rare use only)
- Reserved for case study pull quotes or single important phrases
- Not a primary typeface—use sparingly
- Weight: 400 or 700 only

### Type Scale

All sizes are base scale; adjust down for mobile.

#### Heading 1
**Inter 700 · 48px · #5D3A7A**

```
Rickie Cruz
```
Main headline, homepage hero, large section headers. Set in Deep Purple. Line-height 1.2.

#### Heading 2
**Inter 600 · 32px · #5D3A7A**

```
Problem
```
Section headers within case studies, feature titles, subsection headers. Set in Deep Purple. Line-height 1.25.

#### Heading 3
**Inter 600 · 24px · #5D3A7A**

```
Technology Decisions
```
Subheadings, card titles, category labels. Set in Deep Purple. Line-height 1.3.

#### Heading 4
**Inter 600 · 18px · #2C3E50**

```
Deployment Strategy
```
Small section headers, sidebar headings. Set in Strong Text. Line-height 1.4.

#### Body Text
**Inter 400 · 16px · #2C3E50 · line-height 1.6**

```
I design and build web applications, explore new interfaces, and help small organizations make sense of their technology.
```
All paragraph text, body copy, case study narratives. Set in Strong Text. Extra line-height for readability.

#### Small Text / Metadata
**Inter 400 · 14px · #6C717A · line-height 1.5**

```
Published September 2026 · Board Member + Director of Digital Operations
```
Bylines, dates, metadata, secondary information. Set in Muted Text.

#### Label / Badge
**Inter 500 · 12px · #2D7A4A (or #5D3A7A) · text-transform: uppercase**

```
ACTIVE
```
Status badges, category labels, small call-outs. Usually on Rich Green background with white text, or white background with Rich Green text.

#### Link
**Inter 500 · 16px · #5D3A7A · underlined**

```
View the full case study
```
Inline links in body text. Set in Deep Purple, underlined. Hover: deeper purple, possibly italic.

### Type Hierarchy Example

```
H1: Rickie Cruz
   ↓ (breathing room)
Body: I design and build web applications...
   ↓ (less breathing room)
H2: Problem
Body: Chatter Snow was growing but had no system...
   ↓
H3: Architecture
Body: We chose Next.js because...
   ↓
Metadata: September 2026 · 15 min read
```

---

## 03 — Spacing & Radius

### Spacing Scale

Base unit: 4px (Tailwind default). Use these recurring values.

| Scale | Pixels | Tailwind |
|-------|--------|----------|
| xs    | 4px    | gap-1    |
| sm    | 8px    | gap-2    |
| md    | 16px   | gap-4    |
| lg    | 24px   | gap-6    |
| xl    | 32px   | gap-8    |
| 2xl   | 48px   | gap-12   |
| 3xl   | 64px   | gap-16   |

### Common Spacing Usage

**Section padding (vertical):**
- Desktop: `py-16` (64px) between major sections
- Tablet: `py-12` (48px)
- Mobile: `py-8` (32px)

**Section padding (horizontal):**
- Desktop: `px-10` (40px)
- Tablet: `px-6` (24px)
- Mobile: `px-4` (16px)

**Card padding:**
- All breakpoints: `p-6` (24px)

**Gap between elements within a card:**
- Headings to text: `mb-4` (16px)
- Text to secondary element: `mb-2` (8px)

**Header/Navigation:**
- Logo to nav: `gap-8` (32px)
- Nav items: `gap-6` (24px)

**Project cards in grid:**
- Gap between cards: `gap-6` (24px) on desktop, `gap-4` (16px) on mobile

### Border Radius

**Buttons & Pills:**
- `rounded-lg` (8px)
- Soft, modern, not corporate

**Cards & Containers:**
- `rounded-xl` (12px)
- Slightly more generous than buttons

**Small elements (badges, inputs):**
- `rounded-md` (6px)
- Proportional to size

**Never use:**
- `rounded-none` (too harsh)
- `rounded-full` (unless intentionally pill-shaped)
- `rounded-3xl` or higher (too organic, not professional)

---

## 04 — Visual Language

### Accent Bar (Signature Element)

**Like Chatter's rainbow bar, but single-color and minimal.**

Thin accent bar above featured content.

**Specifications:**
- Height: 3-4px
- Color: Deep Purple (#5D3A7A)
- Width: 40-60px (NOT full-width)
- Placement: Directly above an h2 or h3
- Usage: Featured projects, main case studies, key sections

**Example:**
```
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓                 │  ← 40-60px Deep Purple bar
│ Chatter Snow                │
│ Digital Operations Platform │
└─────────────────────────────┘
```

### Accent Colors in Context

**Case study callout box:**
- Background: `#F4F6F9` (Cool Silver)
- Left border: 4px solid `#2D7A4A` (Rich Green)
- Padding: `p-6`
- Text: body text in Strong Text color

**Key decision box (in case studies):**
- Background: `#FFFFFF` (White)
- Border: 1px solid `#E0E3E8` (Divider Gray)
- Left border: 3px solid `#5D3A7A` (Deep Purple)
- Padding: `p-6`
- Header: Deep Purple
- Body: Strong Text

**Data visualization (charts, graphs):**
- Primary bars/lines: Rich Green (#2D7A4A)
- Secondary accent: Deep Purple (#5D3A7A)
- Neutral/background: Divider Gray (#E0E3E8)
- Don't use gradients—solid colors only

### Buttons

#### Primary Button
- Background: Deep Purple (#5D3A7A)
- Text: White (#FFFFFF)
- Padding: `px-6 py-3` (24px horizontal, 12px vertical)
- Border radius: `rounded-lg` (8px)
- Font: Inter 600, 16px
- Hover: Slightly darker purple (#4A2A5F) or 90% opacity
- Focus: Visible outline in green (#2D7A4A), 2px, 2px offset

**Example text:** "View my work" · "Start a conversation" · "Download resume"

#### Secondary Button
- Background: `#F4F6F9` (Cool Silver)
- Text: Deep Purple (#5D3A7A)
- Padding: `px-6 py-3`
- Border: 1px solid `#E0E3E8` (Divider Gray)
- Border radius: `rounded-lg`
- Font: Inter 600, 16px
- Hover: Background becomes `#E0E3E8` (Divider Gray)
- Focus: Same as primary

**Example text:** "Learn more" · "Read case study" · "Explore project"

#### Tertiary / Link Button
- Background: transparent
- Text: Deep Purple (#5D3A7A)
- Underline: 1px solid Deep Purple
- Padding: none (just text)
- Hover: Deep Purple + italic + slightly darker

**Example text:** "View source" · "GitHub" · "External link"

### Cards & Containers

**Standard card:**
- Background: White (#FFFFFF)
- Border: none (shadows provide depth)
- Border radius: `rounded-xl` (12px)
- Padding: `p-6`
- Shadow: `shadow-sm` (subtle, Tailwind default)
- Sits on Cool Silver background (#F4F6F9)

**Featured card (project preview):**
- Same as standard card, but:
- Top border: 3px solid Deep Purple (#5D3A7A)
- Shadow: `shadow-md` (slightly more prominent)

**Hover state:**
- Shadow increases to `shadow-lg`
- Subtle scale: `scale-102` or `translate-y-[-2px]`
- All transitions: 200-300ms ease-out

### Form Inputs

**Text inputs, textareas, selects:**
- Background: White (#FFFFFF)
- Border: 1px solid Divider Gray (#E0E3E8)
- Border radius: `rounded-md` (6px)
- Padding: `px-4 py-2`
- Font: Inter 400, 16px, Strong Text color
- Focus: Border becomes Deep Purple (#5D3A7A), 2px width
- Focus shadow: Subtle glow in Purple (10% opacity)
- Placeholder text: Muted Text (#6C717A)

**Label:**
- Font: Inter 500, 14px
- Color: Strong Text (#2C3E50)
- Margin bottom: 8px
- Required indicator: Deep Purple asterisk

---

## 05 — Page Layouts (Templates)

### Homepage Hero Section

```
┌────────────────────────────────────────────┐
│                                            │
│  ▓▓▓▓▓▓▓ (40px Deep Purple bar)           │
│                                            │
│  Rickie Cruz                               │ ← H1, Deep Purple
│  Software engineer building digital        │ ← Subheading, Strong Text
│  products and systems.                     │
│                                            │
│  [View my work]  [Let's talk]              │ ← Buttons: Primary + Secondary
│                                            │
│  (breathing room)                          │
│                                            │
└────────────────────────────────────────────┘
```

**Colors:**
- Background: Cool Silver (#F4F6F9)
- Headline: Deep Purple (#5D3A7A)
- Body text: Strong Text (#2C3E50)
- Accent bar: Deep Purple (#5D3A7A)
- Buttons: Primary (Deep Purple) + Secondary (Silver)

---

### Featured Project Card (on Homepage)

```
┌──────────────────────────────┐
│ ┌─────────────────────────────│ ← White card on Silver background
│ │                            │
│ │ ▓▓▓▓▓▓▓▓ (60px Purple bar) │
│ │                            │
│ │ Chatter Snow               │ ← H3, Deep Purple
│ │ Digital Operations         │
│ │ Platform                   │ ← Subheading, Muted Text
│ │                            │
│ │ Built the digital          │ ← Body, Strong Text
│ │ infrastructure supporting  │
│ │ a growing LGBTQ+ nonprofit.│
│ │                            │
│ │ Next.js · Supabase ·       │ ← Tech tags: Secondary button style
│ │ Vercel · Cloudflare        │
│ │                            │
│ │ [Read case study →]        │ ← Link button, Deep Purple
│ │                            │
│ └────────────────────────────┘
```

**Colors:**
- Card background: White (#FFFFFF)
- Page background: Cool Silver (#F4F6F9)
- Headline: Deep Purple (#5D3A7A)
- Body: Strong Text (#2C3E50)
- Metadata: Muted Text (#6C717A)
- Tech tags: `background: #F4F6F9, text: #2D7A4A`
- Accent bar: Deep Purple (#5D3A7A)

---

### Case Study Section

```
┌────────────────────────────────────────────┐
│ (Cool Silver Background #F4F6F9)           │
│                                            │
│  ▓▓▓▓▓▓▓▓ (40px bar)                      │
│  Problem                     ← H2 Purple   │
│                                            │
│  Chatter Snow was growing but had no       │ ← Body text, Strong Text
│  system to track inventory or communicate │
│  what equipment was available.             │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ ▓ (3px left border Green)            │ │ ← Key insight box
│  │ Core issue: No centralized system    │ │    Silver background
│  │ to show community what gear exists.  │ │    Green left border
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

**Colors:**
- Section background: Cool Silver (#F4F6F9)
- Heading: Deep Purple (#5D3A7A)
- Accent bar: Deep Purple (#5D3A7A)
- Body text: Strong Text (#2C3E50)
- Callout box background: White (#FFFFFF)
- Callout left border: Rich Green (#2D7A4A)

---

### Data Visualization (Charts)

**Spending by Category (Bar Chart)**
- Bars: Rich Green (#2D7A4A)
- Axis labels: Muted Text (#6C717A)
- Grid lines: Divider Gray (#E0E3E8)
- Background: White or transparent

**Cash Runway Forecast (Line Chart)**
- Primary line: Rich Green (#2D7A4A)
- Secondary accent: Deep Purple (#5D3A7A)
- Grid: Divider Gray (#E0E3E8)
- Data points: Small circles in Rich Green

**Debt Breakdown (Pie/Donut)**
- Slice 1: Rich Green (#2D7A4A) — 60%
- Slice 2: Deep Purple (#5D3A7A) — 25%
- Slice 3: Divider Gray (#E0E3E8) — 15%
- Labels: Strong Text (#2C3E50)
- Hover: Slightly lighter/darker version of slice color

---

### Contact Form

```
┌────────────────────────────────────────────┐
│                                            │
│  Get in touch                   ← H2       │
│                                            │
│  Name *                                    │
│  [_________________________]               │ ← Input field
│                                            │
│  Email *                                   │
│  [_________________________]               │ ← Input field
│                                            │
│  Organization                              │
│  [_________________________]               │ ← Input field
│                                            │
│  What can I help with? *                   │
│  ○ Consulting                              │ ← Radio options
│  ○ Website / application                   │    in Rich Green
│  ○ Technical question                      │
│  ○ Collaboration                           │
│                                            │
│  Message *                                 │
│  [_____________________________]           │ ← Textarea
│  [_____________________________]           │
│                                            │
│              [Start a conversation]        │ ← Primary button
│                                            │
└────────────────────────────────────────────┘
```

**Colors:**
- Background: Cool Silver (#F4F6F9)
- Labels: Strong Text (#2C3E50)
- Input borders: Divider Gray (#E0E3E8)
- Input focus: Deep Purple (#5D3A7A)
- Radio checked: Rich Green (#2D7A4A)
- Button: Deep Purple (#5D3A7A)

---

## 06 — Component Library

### Badges / Labels

**Status Badge - Active**
- Background: Rich Green (#2D7A4A)
- Text: White (#FFFFFF)
- Font: Inter 500, 12px, uppercase
- Padding: `px-3 py-1`
- Border radius: `rounded-md` (6px)

**Status Badge - Featured**
- Background: Deep Purple (#5D3A7A)
- Text: White (#FFFFFF)
- Font: Inter 500, 12px, uppercase
- Padding: `px-3 py-1`
- Border radius: `rounded-md` (6px)

**Tech Tag**
- Background: Cool Silver (#F4F6F9)
- Text: Strong Text (#2C3E50)
- Border: 1px solid Divider Gray (#E0E3E8)
- Font: Inter 500, 13px
- Padding: `px-3 py-1`
- Border radius: `rounded-md` (6px)

### Navigation

**Header:**
- Background: White (#FFFFFF)
- Border bottom: 1px solid Divider Gray (#E0E3E8)
- Logo text: Deep Purple (#5D3A7A), Inter 700, 20px
- Nav links: Strong Text (#2C3E50), Inter 500, 14px
- Active link: Deep Purple (#5D3A7A) + underline
- Hover link: Deep Purple (#5D3A7A), slight opacity increase
- Dark mode toggle button: Deep Purple icon on hover

**Footer:**
- Background: Cool Silver (#F4F6F9)
- Text: Muted Text (#6C717A), Inter 400, 14px
- Dividers: Divider Gray (#E0E3E8)
- Links: Deep Purple (#5D3A7A), underlined on hover

---

## 07 — Dark Mode

If implementing dark mode, invert intelligently:

| Light | Dark |
|-------|------|
| #F4F6F9 (Background) | #0F1117 (Dark Background) |
| #FFFFFF (Surface) | #1C1F26 (Dark Surface) |
| #2C3E50 (Strong Text) | #E0E3E8 (Light Text) |
| #6C717A (Muted Text) | #7E8697 (Dark Muted) |
| #E0E3E8 (Dividers) | #2D3139 (Dark Dividers) |
| #5D3A7A (Purple) | #9B7AC9 (Lighter Purple) |
| #2D7A4A (Green) | #5FB876 (Lighter Green) |

**Implementation:**
- Use CSS variables or Tailwind's `dark:` prefix
- Respect `prefers-color-scheme` media query
- Provide manual toggle in header
- Store user preference in localStorage

---

## 08 — Quick Reference

### Color Quick Copy

```
Primary Purple:    #5D3A7A
Secondary Green:   #2D7A4A
Alert Red:         #B3261E   (semantic only — over-limit / destructive)
Background:        #F4F6F9
Surface White:     #FFFFFF
Divider Gray:      #E0E3E8
Muted Text:        #6C717A
Strong Text:       #2C3E50
```

### Typography Quick Copy

```
H1: Inter 700, 48px, #5D3A7A
H2: Inter 600, 32px, #5D3A7A
H3: Inter 600, 24px, #5D3A7A
Body: Inter 400, 16px, #2C3E50, line-height 1.6
Small: Inter 400, 14px, #6C717A
Links: Inter 500, 16px, #5D3A7A, underlined
```

### Spacing Quick Copy

```
Section padding (vertical): py-16 (desktop), py-12 (tablet), py-8 (mobile)
Section padding (horizontal): px-10 (desktop), px-6 (tablet), px-4 (mobile)
Card padding: p-6 (all breakpoints)
Gap between cards: gap-6 (desktop), gap-4 (mobile)
Elements within card: mb-4 (headings), mb-2 (secondary)
```

### Button Quick Copy

**Primary:**
- BG: #5D3A7A, Text: White
- Padding: px-6 py-3
- Radius: rounded-lg

**Secondary:**
- BG: #F4F6F9, Text: #5D3A7A, Border: #E0E3E8
- Padding: px-6 py-3
- Radius: rounded-lg

---

## 09 — What NOT to Do

❌ **Don't use:**
- Pure black (#000000) for text — use Strong Text (#2C3E50)
- Pure white (#FFFFFF) for page background — use Cool Silver (#F4F6F9)
- Green or Purple as full-bleed backgrounds for body text
- Gradients (unlike Chatter's rainbow)
- More than 5 colors in a single page view
- Small text in Pure Purple or Pure Green (contrast fails)
- Rounded pill buttons unless they're actually pill-shaped
- Full-width accent bars (always 40-60px maximum)
- Drop shadows on every element (only on cards and hover states)
- More than 2 fonts on a single page

❌ **Don't design like Chatter:**
- Vibrant, energetic, celebratory vibe
- Playful display typefaces
- Colorful gradients
- Heavy pattern usage
- Community/social positioning

✅ **Do design like you:**
- Professional, intentional, expert
- Single-color accents
- Clean, restrained layouts
- Technical precision
- Problem-solving focus

---

## 10 — Design System Expansion

**Reserved for future use** (not needed for MVP):

- Icon system (if you create custom icons, use Deep Purple or Rich Green strokes)
- Loading states (subtle purple spinner or progress bar)
- Toast notifications (use either color depending on message type)
- Tooltip styling (white background, Strong Text, subtle shadow)
- Empty states (Cool Silver background, Muted Text message, optional accent illustration)
- Error states (use Rich Green for success, Deep Purple for warnings, consider adding a red accent for errors if needed)

---

## 11 — Figma Setup

**If creating a Figma file:**

1. Create color variables:
   - `color/primary-purple`: #5D3A7A
   - `color/secondary-green`: #2D7A4A
   - `color/background`: #F4F6F9
   - `color/surface-white`: #FFFFFF
   - `color/divider-gray`: #E0E3E8
   - `color/muted-text`: #6C717A
   - `color/strong-text`: #2C3E50

2. Create text styles:
   - `heading-1`, `heading-2`, `heading-3`, `heading-4`
   - `body`, `body-small`, `link`, `label`

3. Create components:
   - Button (primary + secondary + tertiary states)
   - Card (standard + featured)
   - Badge (status + tech tag)
   - Form input (text + select + textarea)
   - Navigation (header + footer)

4. Create a page called "Color Reference" with all swatches and usage notes

5. Lock all reference pages so you don't accidentally edit them

---

## 12 — Keeping It Consistent

**Daily checklist while building:**

- [ ] Headline in Deep Purple?
- [ ] Body text in Strong Text?
- [ ] Accent bar thin and single-color?
- [ ] No gradients?
- [ ] Spacing follows 4px grid?
- [ ] Cards have subtle shadow only?
- [ ] Buttons use correct padding and radius?
- [ ] Focus states visible and green?
- [ ] No pure white backgrounds on page?
- [ ] All text meets WCAG AA contrast ratio?

---

## 13 — References & Resources

**Tools:**
- Figma (design)
- Tailwind CSS (implementation)
- WebAIM Contrast Checker (accessibility verification)

**Inspiration (for consistency, not copying):**
- Stripe (professional, minimal color, excellent typography)
- GitHub (clean, technical, restrained)
- Figma (sophisticated use of accent colors)

---

**This guide is living. Update it as the brand evolves. Last checkpoint: September 2026.**
