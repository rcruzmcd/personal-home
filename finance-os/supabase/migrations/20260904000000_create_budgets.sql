-- Per-category monthly spending limits — the "budgeting module" deferred out
-- of the MVP (docs/PERSONAL_FINANCE_REQUIREMENTS.md §"Skip for MVP" and §17,
-- and docs/CASE_STUDIES.md "Decision: No traditional budgeting module in MVP",
-- whose stated cost was "Can't set spending limits (add in v1.1)").
--
-- A budget is ONE STANDING LIMIT PER CATEGORY that applies to every calendar
-- month. There is deliberately no period column and no rollover:
--
--   * No period column, because the limit does not vary by month. A month is
--     therefore only ever a *query* parameter (see budget_spend_by_category
--     below), never a stored dimension — so viewing August and September uses
--     the same row, and there is no "copy last month's budget" step that a
--     per-month table would force on the user every 1st.
--   * No rollover, because carrying a leftover forward makes "what is my Food
--     limit" depend on an unbounded chain of prior months. Each month starts
--     fresh at the limit, which is what a monthly spending limit means to the
--     person setting it.
--
-- Consumed by src/lib/calculations/budgets.ts (the pure summary builder) via
-- src/app/(app)/budgets/page.tsx, the dashboard widget in
-- src/app/(app)/page.tsx, the alerts in src/app/(app)/inbox/page.tsx, the
-- forecast in src/app/(app)/forecast/page.tsx, and the remaining-budget hint
-- in src/app/(app)/transactions/transaction-form-content.tsx.

create table budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  -- Only categories.type = 'expense' is budgetable; that is enforced in the
  -- form's option list rather than by a constraint, because category_type
  -- lives on the referenced row and a check constraint cannot read it.
  category_id uuid not null references categories (id) on delete cascade,
  -- Positive magnitude per month, matching how a person states a limit
  -- ("$600 for Food"). Spend is compared against it via abs() — see below.
  amount numeric(14, 2) not null check (amount > 0),
  -- No `active` flag, unlike recurring_expenses/accounts: the budgets grid
  -- saves every category at once and a cleared input deletes the row, so
  -- "I don't want a limit here" is already fully expressed by the row's
  -- absence. A paused-but-remembered limit would be schema no UI can reach.
  created_at timestamptz not null default now(),
  -- One limit per category is the whole model, and it is also what lets the
  -- budgets grid save every row in a single upsert with
  -- onConflict: "user_id,category_id" (src/app/(app)/budgets/actions.ts).
  -- user_id is redundant with category_id's own ownership but has to be in the
  -- constraint for that upsert target to exist.
  unique (user_id, category_id)
);

create index budgets_user_id_idx on budgets (user_id);

alter table budgets enable row level security;

create policy "budgets: owner access" on budgets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- No grants needed: 20260831000002_grant_authenticated_privileges.sql sets
-- default privileges on future tables in this schema for `authenticated`.

-- Spend for one calendar month, bucketed by category and aggregated in the
-- database. docs/UX_PATTERNS.md rule 2 requires it: totals that describe a
-- whole set must be a DB aggregate, since summing rows fetched through
-- PostgREST is silently truncated by its row cap. Four surfaces need exactly
-- these numbers (budgets page, dashboard widget, inbox, transaction form), so
-- there is one definition of "spend against a budget" rather than four.
--
-- Only type = 'expense' counts. Transfers between the user's own accounts must
-- never count as spending (§3 "Critical: Transfers between your own accounts
-- should NOT count as spending"), and refund/adjustment rows are not spending
-- either — the same filter calculateMonthlyBurn applies in
-- src/lib/calculations/burn.ts.
--
-- abs() because expenses are stored signed-negative while a limit is a
-- positive magnitude. A null category_id is preserved as its own bucket rather
-- than dropped, so uncategorized spend can be surfaced instead of silently
-- vanishing from the page's totals.
--
-- security invoker so RLS still scopes rows to the calling user; stable so the
-- planner can reuse the result within a statement. Same contract as
-- transaction_totals (20260901000003_transaction_totals.sql). p_end is
-- inclusive, as it is there.
create function budget_spend_by_category(p_start date, p_end date)
returns table (category_id uuid, spent numeric)
language sql
security invoker
stable
as $$
  select t.category_id, coalesce(sum(abs(t.amount)), 0) as spent
  from transactions t
  where t.type = 'expense'
    and t.date >= p_start
    and t.date <= p_end
  group by t.category_id;
$$;

grant execute on function budget_spend_by_category(date, date) to authenticated;

-- The rollup above filters on date and is RLS-scoped on user_id; category_id
-- is only the GROUP BY key, so a (category_id, date) index could not drive it
-- and transactions_category_id_idx already covers the FK. What the query
-- actually needs is (user_id, date) — which the dashboard, forecast and inbox
-- also need, since each runs an account-less .gte("date", cutoff) that today
-- has only transactions_user_id_idx to work with.
create index transactions_user_id_date_idx on transactions (user_id, date);
