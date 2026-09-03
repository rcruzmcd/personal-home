-- Statement history for revolving debt (docs/PERSONAL_FINANCE_REQUIREMENTS.md
-- §6 "Per-Debt Tracking"). Each row is one closed billing cycle as the issuer
-- actually stated it: the balance on the closing date and the minimum then due.
--
-- accounts.minimum_payment stays the *standing* figure — the forecast and
-- debt-payoff engines iterate future months where no statement exists, so they
-- need a projection input (src/lib/calculations/forecast.ts, debt-payoff.ts).
-- Recording a statement updates it, the same relationship reconciliations
-- already has with accounts.balance (see 20260901000000_create_reconciliations).
--
-- A row exists ONLY once the user has recorded it. That is deliberate: "which
-- statements still need entering" is then a pure computation — the closes
-- implied by accounts.statement_day, minus the rows present
-- (src/lib/calculations/statements.ts) — with no scheduled job creating
-- placeholder rows and no recorded/unrecorded flag to keep in sync.

create table statements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  account_id uuid not null references accounts (id) on delete cascade,
  -- The cycle's close, resolved from accounts.statement_day and clamped to the
  -- month's length (a card closing on the 31st closes Feb 28).
  closing_date date not null,
  due_date date not null,
  statement_balance numeric(14, 2) not null,
  minimum_payment numeric(14, 2) not null,
  notes text,
  created_at timestamptz not null default now(),
  -- Recording the same close twice is the expected double-submit, not an edge
  -- case: this is what makes it idempotent.
  unique (account_id, closing_date)
);

create index statements_user_id_idx on statements (user_id);
create index statements_account_id_closing_date_idx on statements (account_id, closing_date desc);

alter table statements enable row level security;

create policy "statements: owner access" on statements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
