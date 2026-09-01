-- Balance reconciliation (docs/PERSONAL_FINANCE_REQUIREMENTS.md §2 "Balance
-- Reconciliation" and §12 "Reconciliation UI"). Each row is a snapshot of
-- one reconciliation attempt for an account: the system's expected balance
-- vs. what the bank actually reports, with the difference and an
-- explanation for it. accounts.balance and accounts.last_updated are
-- updated to the bank balance as part of reconciling (see the
-- reconcileAccount server action) so the account list always reflects the
-- last-confirmed balance; this table is the audit trail of how it got
-- there.

create type reconciliation_explanation as enum (
  'pending_transaction',
  'rounding',
  'input_error',
  'other'
);

create table reconciliations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  account_id uuid not null references accounts (id) on delete cascade,
  expected_balance numeric(14, 2) not null,
  bank_balance numeric(14, 2) not null,
  difference numeric(14, 2) not null,
  explanation reconciliation_explanation,
  notes text,
  created_at timestamptz not null default now()
);

create index reconciliations_account_id_created_at_idx on reconciliations (account_id, created_at desc);

alter table reconciliations enable row level security;

create policy "reconciliations: owner access" on reconciliations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
