# Personal Finance OS — Requirements (MVP)

## Overview

**Working Name:** Personal Finance OS

**Primary Objective:** Give you a continuously updated, accurate picture of your financial position and help you make decisions about cash, debt, spending, and future income.

**Core Questions It Should Answer:**
1. Where is my money?
2. Where is my money going?
3. How much do I owe?
4. How long can I sustain my current situation?
5. What should I do next?

**Note:** This is NOT primarily a budgeting app. Budgeting is one component of a broader financial-management system.

**Deployment:** Ships as two separate instances of the same app (see `docs/TECH_STACK_AND_DOMAIN.md` → "Personal Finance: Two Instances") — a private instance holding your real financial data, and a public showcase instance seeded with fake data for the portfolio case study. Everything in this spec (data model, calculations, UI) applies to both; only the underlying data and access controls differ.

> **Status:** Built in `finance-os/` — Supabase auth/schema/RLS, dashboard, accounts (incl. reconciliation), transactions (manual entry + CSV/XLSX import + dedup + rule-based categorization), income sources, cash flow/forecast engine, and all three MVP nice-to-haves (recurring expenses, alerts/inbox, reconciliation). Not yet built: debt payoff calculator (avalanche/snowball), a dedicated debt dashboard, transaction search/filter, and deployment. See §15 for the itemized checklist.

---

## MVP Scope (2-Week Build)

### Must Have for MVP

| Module           | Purpose                        | Status   |
|------------------|--------------------------------|----------|
| Dashboard        | Overall financial position     | Required |
| Accounts         | Track financial accounts       | Required |
| Transactions     | Understand actual spending     | Required |
| Debt             | Manage debt and payoff         | Required |
| Income           | Track salary/severance/etc.    | Required |
| Cash Flow        | Understand money coming/going  | Required |
| Forecast         | Project future financial pos.  | Required |
| Categories       | Organize transactions          | Required |
| Recurring Exp.   | Identify obligations           | Nice-to-have |

### Skip for MVP (Add in v1.1+)

- Bank sync / Plaid integration
- Advanced reports
- Budgeting module (will add once employed)
- Net worth tracking over time
- Scenarios/"What if" analysis
- Goals tracking
- Recurring expense auto-detection (manual for MVP)
- Investments tracking

---

## 1. Dashboard (Primary Screen)

This is the home screen. Show financial position at a glance.

### Financial Position Widget

```
NET WORTH
-$42,850

Cash              $8,420
Investments       $3,200
Credit Cards    -$31,500
Loans           -$22,970
─────────────────────────
Net Worth       -$42,850
```

**Fields:**
- Total assets (cash + investments)
- Total liabilities (debt)
- Net worth (assets - liabilities)
- Breakdown by account type

### Cash Runway Widget (Most Important)

This is your core metric for decision-making.

```
CASH RUNWAY

$8,420 available

Essential burn         $2,150/mo
Total burn             $3,480/mo

Essential runway       3.9 months
Current runway         2.4 months

Projected cash floor   Nov 18
```

**Fields:**
- Current available cash
- Essential monthly expenses (housing, utilities, insurance, food)
- Total monthly expenses (essential + discretionary)
- Expected monthly income (if any)
- Calculated runway (months until zero)
- Projected date when cash runs out
- Make it clickable to see calculation breakdown

### Quick Stats

```
Total Debt:        $54,470
Credit Util:       60%
Min Payments:      $1,240/mo
Est. Interest:     $810/mo
```

---

## 2. Accounts

An account represents an actual financial account (checking, savings, credit card, loan, etc.).

### Account Types

- Checking
- Savings
- Cash
- Credit Card
- Personal Loan
- Auto Loan
- Student Loan
- Mortgage
- Brokerage
- Retirement
- Other Asset
- Other Liability

### Account Fields

Each account needs:
- Name (user-friendly: "Chase Checking")
- Institution (Chase, Bank of America, etc.)
- Account type (Checking, Savings, etc.)
- Account subtype (optional)
- Current balance
- Credit limit (for credit cards)
- Interest rate (for debt)
- Opening date
- Last updated (auto-tracked)
- Active/inactive toggle
- Notes (optional)

### Special Handling: Credit Cards

```
Account Name:      Chase Sapphire
Balance:           $7,250
Credit Limit:      $12,000
Utilization:       60.4%
APR:               24.99%
Minimum Payment:   $215
Due Date:          Sep 14
```

### Important: Balance Reconciliation

Support reconciliation (balance in system vs. bank).

```
Expected balance:     $4,287.31
Imported balance:     $4,302.31
Difference:           $15.00
```

Users should be able to adjust for rounding/pending transactions.

### UI

**Accounts List:**
- Show all accounts
- Sort by type or balance
- Add/edit/delete accounts
- See current balance at a glance

**Account Detail:**
- Account info
- Recent transactions
- Reconciliation status
- Edit option

---

## 3. Transactions

**This is the largest data domain.** Track where money actually goes.

### Transaction Fields

Each transaction needs:
- Date
- Posted date (different from transaction date)
- Description (user input)
- Merchant (parsed from description)
- Amount
- Account
- Transaction type (Expense, Income, Transfer, Refund, Adjustment)
- Category
- Subcategory
- Recurring status (yes/no)
- User notes
- Tags (optional)
- Import source (if imported)
- Original description (from import)
- Transaction ID (unique identifier)

### Transaction Types

- **Expense** — Money going out
- **Income** — Money coming in
- **Transfer** — Money between your accounts (should NOT count as spending)
- **Refund** — Money back
- **Adjustment** — Manual corrections

**Critical:** Transfers between your own accounts should NOT count as spending.

Example:
```
Checking → Savings: Transfer ($500)
[Does not count as expense]

Credit Card Payment: Transfer (-$1,000)
[Does not count as another expense if purchase already recorded]
```

### Transaction Import

Support multiple input methods:
- Manual entry (one at a time)
- CSV import (bulk)
- XLSX import (bulk)

**CSV mapping:**
```
Column in CSV  →  Transaction field
Date           →  date
Description    →  description
Amount         →  amount
Account        →  account (mapped to account name)
```

**Import workflow:**
1. Upload file
2. Map columns
3. Preview transactions
4. Validate
5. Import
6. Deduplicate (detect duplicates)

---

## 4. Categorization

**Rule-based + manual override** (simpler than ML for MVP)

### Categories (Suggested Starting List)

**Essential:**
- Housing (rent, mortgage, utilities)
- Food (groceries)
- Transportation
- Insurance
- Healthcare
- Phone/Internet
- Childcare (if applicable)

**Discretionary:**
- Dining out / Restaurants
- Entertainment
- Shopping
- Subscriptions
- Personal care
- Fitness

**Savings/Transfer:**
- Savings transfer
- Investment

**Income:**
- Salary
- Severance
- Unemployment
- Freelance
- Other income

### Categorization Rules

Rule-based categorization to avoid manual work:

```
Rule 1:
  Merchant contains "UBER" OR "LYFT"
  → Category: Transportation
  → Subcategory: Rideshare
  → Recurring: No

Rule 2:
  Merchant = "Netflix"
  → Category: Entertainment
  → Subcategory: Streaming
  → Recurring: Yes

Rule 3:
  Merchant contains "WHOLE FOODS" OR "TRADER JOES"
  → Category: Food
  → Subcategory: Groceries
  → Recurring: No
```

**Rule Fields:**
- Match condition (merchant contains X, equals Y)
- Category
- Subcategory
- Tags
- Priority (if multiple rules match)
- Active/inactive

**Fallback:** User can manually override categorization.

---

## 5. Spending Analysis

Answer: "Where did my money go?"

### Monthly View

```
August 2026

Housing              $2,100
Food                   $840
Transportation         $320
Shopping               $650
Entertainment          $280
Subscriptions          $145
Other                  $310
─────────────────────────────
Total                $4,645
```

Display:
- Category
- Spend this month
- Percentage of total
- Chart visualization

### Trends

Compare current month vs:
- Previous month
- 3-month average
- 6-month average
- 12-month average

Example:
```
Restaurants: +$310 / +42% vs 6-month average
Coffee: -$45 / -18% vs 6-month average
```

### Filters

- By category
- By date range
- By account
- By merchant
- Search

---

## 6. Debt Module

Track and manage debt strategically.

### Debt Dashboard

```
TOTAL DEBT
$54,470

Credit cards        $31,500  (58%)
Personal loans      $12,000  (22%)
Student loans       $10,970  (20%)

Minimum payments    $1,240/mo
Estimated interest    $810/mo
```

### Per-Debt Tracking

For each debt account:
- Balance
- APR
- Credit limit (if credit card)
- Minimum payment
- Due date
- Statement date
- Loan term (if applicable)
- Original principal (if loan)
- Remaining principal
- Interest paid to date
- Fees
- Promotional APR (if applicable)
- Promotional APR expiration

### Statement History

Due date and statement date are stored as a **day of the month** (1-31), not a date:
a card closes and falls due on the same day every cycle, so a single stored date
goes stale after one month. A day past the 28th resolves to the last day of
shorter months, the way an issuer actually bills.

Each closed cycle is recorded in its own row (`statements`): closing date, due
date, the statement balance, and the minimum then due. This is the audit trail;
`accounts.minimum_payment` remains the *standing* figure the forecast and
debt-payoff engines project future months with, and recording a statement
updates it. The same split as `reconciliations` vs. `accounts.balance`.

**Prompt to record.** A statement row exists only once the user has entered it,
so an outstanding cycle is derived rather than stored — the close implied by the
account's statement day, minus the rows on file. Only the most recent close is
raised, so a long-neglected account produces one prompt rather than a backlog.
It surfaces in three places: the Inbox (as an actionable alert), the account's
own page, and the Dashboard.

### Payoff Strategies

Calculate different payoff approaches:

**Avalanche** (Highest APR first)
- Minimum payments to all
- Extra payment to highest APR
- Result: Minimum interest paid

**Snowball** (Lowest balance first)
- Minimum payments to all
- Extra payment to lowest balance
- Result: Quick wins, psychological momentum

**Custom**
- User chooses priority order
- Extra payment to chosen debt

For each strategy, show:
- Monthly payment required
- Total interest paid
- Debt-free date
- Months saved vs. minimum payments

**Example:**
```
Strategy: Avalanche
Monthly extra payment: $500

Credit Card (24.99% APR):  Payoff in 18 months
Personal Loan (7% APR):    Payoff in 42 months
Student Loan (5% APR):     Payoff in 48 months

Debt-free date: December 2027
Total interest: $8,420
```

---

## 7. Income

Track income separately from transactions (expected vs. actual).

### Income Types

- Salary
- Severance
- Unemployment
- Freelance
- Investment income
- Gifts
- Other

### Income Fields (Per Source)

- Source name (e.g., "ADP salary")
- Amount
- Frequency (monthly, weekly, one-time)
- Start date
- End date (if applicable)
- Expected date (for future income)
- Confidence level (certain, likely, possible)
- Tax treatment (taxable, non-taxable)
- Notes

**Example:**

```
Income Source 1:
  ADP Salary
  Amount: $6,500/month
  Frequency: Monthly
  Status: Ended July 2026

Income Source 2:
  Severance
  Amount: $42,000
  Expected: September 2026 (lump sum)
  Confidence: Certain

Income Source 3:
  Unemployment
  Amount: $825/week
  Expected: Starting Sept 1, 2026
  Duration: 26 weeks (until February)
  Confidence: Likely
```

This is key for forecasting. Expected future income ≠ historical income.

---

## 8. Cash Flow Engine

The heart of the application.

For each future period (typically monthly):

```
Starting Cash
+ Expected Income
- Expected Expenses
- Debt Payments
+/- Transfers
= Ending Cash
```

**Frequency options:**
- Daily (for short-term planning)
- Weekly (useful for near-term)
- Monthly (primary reporting)

**For MVP: Focus on monthly.**

### Calculation Logic

**Essential Expenses:**
- Recurring expenses marked as "essential"
- Housing, utilities, insurance, food, minimum debt payments

**Total Expenses:**
- Essential + discretionary spending
- Based on recent average

**Expected Income:**
- Sum of all expected income sources for that period

**Transfers:**
- Money between your accounts (net out)

**Cash Runway Calculation:**
```
Months until zero = Current Cash / Average Monthly Burn
```

---

## 9. Forecast

Project your financial position 30, 60, 90 days ahead and 6/12/24 months.

### Forecast Display

```
CURRENT
Cash:            $8,420
Debt:           $54,470
Net Worth:      -$46,050

30 DAYS
Cash:            $5,940
Debt:           $53,810
Net Worth:      -$47,870

90 DAYS
Cash:            $1,500
Debt:           $52,100
Net Worth:      -$50,600

6 MONTHS
Cash:          -$2,000 ⚠️
Debt:          $48,200
Net Worth:     -$50,200

12 MONTHS
Cash:          -$12,000 ⚠️
Debt:          $38,600
Net Worth:     -$50,600
```

### Warnings

Proactively flag problems:
```
⚠️  Current spending pattern results in 
    projected cash shortfall in January 2027
```

### Assumptions Display

Show what forecast is based on:
```
Income:        $825/week (unemployment, 26 weeks)
Essential exp: $2,150/month
Total exp:     $3,480/month
```

---

## 10. Recurring Expenses

**Status:** Implemented — `/recurring` in `finance-os/` (list, add/edit/delete, monthly-equivalent total across mixed frequencies). Auto-detection and linking are built: the Inbox (§11) infers a cadence (weekly/monthly/annually) per merchant and surfaces candidates with a one-click "Track as recurring" link; confirming it retroactively links the matched transactions, and new/imported transactions auto-link to an already-tracked recurring expense going forward (`transactions.recurring_expense_id`).

Identify and track recurring obligations.

### Recurring Expense Detection

For MVP: Manual entry (mark transactions as recurring when they appear)

**Later:** Auto-detect based on patterns — done: cadence inferred from the gaps between a merchant's occurrences (`src/lib/calculations/cadence.ts`), grouped by merchant identity rather than exact amount so a mid-series price change still reads as one candidate instead of two sub-threshold groups.

### Per-Recurring-Expense Fields

- Name (e.g., "Netflix")
- Merchant
- Amount
- Frequency (daily, weekly, monthly, annually)
- Next expected date
- Category
- Account
- Active/inactive
- Last occurrence
- Times occurred

### Recurring Expense Dashboard

```
MONTHLY RECURRING OBLIGATIONS

Total: $3,214

Rent                    $1,500
Utilities                 $150
Phone                      $75
Internet                    $60
Netflix                     $20
Gym                         $50
Car Insurance             $120
Health Insurance          $195
Loan Payment              $244
(etc.)
```

**This is a critical number for forecasting.**

---

## 11. Alerts & Notifications

**Status:** Implemented as `/inbox` in `finance-os/` — cash runway/credit utilization/forecast shortfall/income-ending-soon alerts, uncategorized transactions, possible duplicates, possible recurring patterns, and subscription price-change alerts (comparing a tracked recurring expense's latest linked transaction against its stored amount), each computed by pure, tested functions in `src/lib/calculations/alerts.ts`. Not built: unusual-transaction detection and SMS/email delivery (out of scope per §17).

The app should proactively flag things that need attention.

### Alert Types

**Financial warnings:**
- ⚠️ Cash runway below 3 months
- ⚠️ Credit utilization above 70%
- ⚠️ Projected cash deficit in X months
- ⚠️ Unemployment ending soon (check timeline)

**Spending alerts:**
- ⚠️ Restaurant spending 38% above 6-month average
- ⚠️ Entertainment category 20% over trend
- ⚠️ Unexpected transaction (unusual amount/merchant)

**Payment reminders:**
- ⚠️ $1,250 in bills due within 7 days
- ⚠️ Credit card payment due in 3 days
- ⚠️ Loan payment due Friday

**Changes:**
- ⚠️ Subscription increased from $15.99 → $18.99
- ⚠️ Netflix charged twice (duplicate transaction?)

### Alert UI

Simple "Inbox" view:

```
FINANCIAL DATA INBOX

23 items need review

[12] Alerts
[5]  Transactions needing categorization
[4]  Possible duplicate transactions
[2]  Possible recurring expenses
```

---

## 12. Data Quality / Reconciliation

**Status:** Reconciliation UI implemented — an account detail page (`/accounts/[id]` in `finance-os/`) with reconciliation status/history, a reconcile form (bank balance + explanation reason), and recent transactions; reconciling logs a `reconciliations` row and updates the account balance to match the bank. Data-quality flags beyond reconciliation (missing transactions, merchant-name inconsistencies) live in the Inbox (§11) where they overlap with duplicate/recurring detection; standalone flags for those two aren't built.

Important but easy to overlook.

### Data Quality Issues to Flag

- Duplicate transactions
- Missing transactions (in bank but not in app)
- Uncategorized transactions
- Unreconciled accounts (balance mismatch)
- Unexpected balance differences
- Transfers incorrectly classified as expenses
- Potential refunds
- Potential recurring transactions
- Merchant name inconsistencies

### Reconciliation UI

```
Account: Chase Checking
Last reconciliation: Aug 28

Expected balance:  $4,287.31
Bank balance:      $4,302.31
Difference:         +$15.00

[Explanation]
○ Pending transaction
○ Rounding
○ Input error
○ Other

[Reconcile]
```

---

## 13. Security (Important for Financial Data)

**Data this app contains:**
- Account numbers (last 4 digits only)
- Balances
- Transaction history
- Income data
- Debt information

**What NOT to store:**
- Bank passwords
- Full account numbers
- Credit card numbers / CVV
- Login credentials
- Tax ID / SSN

### Security Measures

- Authentication (simple for personal app)
- Encryption in transit (HTTPS)
- Environment variables for secrets
- No sensitive data in logs
- Row-level authorization (only you see your data)
- Backups (but not to public storage)
- Audit logging (optional for personal app)
- Export/delete capability (your data, your choice)

---

## 14. Data Model (Conceptual)

```
accounts
├── id
├── name
├── institution
├── type (checking, credit_card, loan, etc.)
├── subtype
├── balance
├── credit_limit
├── interest_rate
├── opening_date
├── last_updated
├── active
└── notes

transactions
├── id
├── account_id
├── date
├── posted_date
├── description
├── merchant
├── amount
├── type (expense, income, transfer, refund, adjustment)
├── category_id
├── subcategory
├── recurring_id (if recurring)
├── tags
├── user_notes
├── import_id
└── original_description

categories
├── id
├── name
├── type (expense, income, transfer)
├── color (optional)
└── position

categorization_rules
├── id
├── match_condition (merchant contains X, equals Y)
├── category_id
├── priority
└── active

recurring_expenses
├── id
├── name
├── merchant
├── amount
├── frequency
├── next_date
├── category_id
├── account_id
├── active
├── last_occurrence
└── occurrences_count

income_sources
├── id
├── name
├── amount
├── frequency
├── start_date
├── end_date
├── expected_date
├── confidence
├── tax_treatment
└── notes
```

---

## 15. MVP Checklist

### Week 1

- [x] Next.js + TypeScript repo created
- [x] Supabase project set up — local dev stack; hosted project still outstanding
- [x] Database schema created
- [x] Authentication set up (simple)
- [x] Dashboard layout (HTML/CSS)
- [x] Net worth calculation engine
- [x] Cash runway calculation
- [x] Accounts: Create/read/update/delete
- [x] Transaction: Manual entry form
- [x] Transaction: CSV import (basic) — shipped with XLSX import too, plus dedup

### Week 2

- [x] Categories and rules engine — rules are seeded via SQL; no rules-admin UI yet
- [x] Categorization UI (assign/override) — per-transaction manual override in the transaction form
- [ ] Debt payoff calculator (avalanche/snowball)
- [ ] Debt dashboard
- [x] Cash flow calculation
- [x] Forecast: 30/60/90 days + 6/12 months
- [x] Income sources: Add/track
- [ ] Search/filter transactions
- [x] Styling and responsive design — brand design system ported from `personal-home`; not verified on real devices
- [ ] Test across devices
- [ ] Deploy to Vercel
- [ ] Add to rickiecruz.com

### Nice-to-haves (originally "skip for MVP")

- [x] Recurring expenses (§10)
- [x] Alerts / inbox (§11)
- [x] Reconciliation UI (§12)

---

## 16. Technical Stack

- **Frontend:** Next.js + TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase auth
- **Data viz:** Recharts (lightweight, works in Next.js)
- **Hosting:** Vercel
- **Environment:** Development, staging, production

---

## 17. Future Enhancements (v1.1+)

- [ ] Bank sync (Plaid integration)
- [ ] Scenarios/"What if" engine
- [ ] Advanced reporting (PDF export)
- [ ] Budgeting module
- [ ] Net worth tracking over time (with visualization)
- [ ] Investment tracking
- [ ] Tax planning
- [ ] Goal tracking
- [ ] Mobile app
- [x] Recurring expense auto-detection (§10)
- [ ] Notifications/alerts (SMS/email)
- [ ] API for external integrations
- [ ] Data export (CSV, JSON, etc.)

---

## Resources

- **Supabase docs:** https://supabase.com/docs
- **Next.js docs:** https://nextjs.org/docs
- **Recharts docs:** https://recharts.org/
