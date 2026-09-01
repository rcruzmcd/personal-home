-- Initial schema for Personal Finance OS MVP.
-- Mirrors the conceptual data model in docs/PERSONAL_FINANCE_REQUIREMENTS.md
-- §14, plus the account-level debt fields described in §2 and §6 (this app
-- has no separate "debts" table — a debt is just an account of type
-- credit_card/personal_loan/auto_loan/student_loan/mortgage with those
-- fields populated).
--
-- Every table carries user_id and row-level security scoped to auth.uid()
-- so the private and showcase instances (see docs/TECH_STACK_AND_DOMAIN.md
-- → "Personal Finance: Two Instances") stay isolated even though they run
-- the same schema.

create extension if not exists "pgcrypto";

create type account_type as enum (
  'checking',
  'savings',
  'cash',
  'credit_card',
  'personal_loan',
  'auto_loan',
  'student_loan',
  'mortgage',
  'brokerage',
  'retirement',
  'other_asset',
  'other_liability'
);

create type transaction_type as enum (
  'expense',
  'income',
  'transfer',
  'refund',
  'adjustment'
);

create type category_type as enum ('expense', 'income', 'transfer');

create type recurring_frequency as enum ('daily', 'weekly', 'monthly', 'annually');

create type income_frequency as enum ('monthly', 'weekly', 'one_time');

create type confidence_level as enum ('certain', 'likely', 'possible');

create type tax_treatment as enum ('taxable', 'non_taxable');

-- categories -----------------------------------------------------------

create table categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  type category_type not null,
  color text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index categories_user_id_idx on categories (user_id);

-- accounts (also carries per-debt fields for credit_card/loan/mortgage) --

create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  institution text,
  type account_type not null,
  subtype text,
  balance numeric(14, 2) not null default 0,
  active boolean not null default true,
  opening_date date,
  notes text,

  -- Credit card / loan fields (§2, §6) — null for cash/checking/savings.
  credit_limit numeric(14, 2),
  interest_rate numeric(6, 3), -- APR, percent
  minimum_payment numeric(14, 2),
  due_date date,
  statement_date date,
  loan_term_months integer,
  original_principal numeric(14, 2),
  remaining_principal numeric(14, 2),
  interest_paid_to_date numeric(14, 2),
  fees numeric(14, 2),
  promotional_apr numeric(6, 3),
  promotional_apr_expires_on date,

  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index accounts_user_id_idx on accounts (user_id);

-- recurring_expenses -----------------------------------------------------

create table recurring_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  merchant text,
  amount numeric(14, 2) not null,
  frequency recurring_frequency not null,
  next_date date,
  category_id uuid references categories (id) on delete set null,
  account_id uuid references accounts (id) on delete set null,
  active boolean not null default true,
  last_occurrence date,
  occurrences_count integer not null default 0,
  created_at timestamptz not null default now()
);

create index recurring_expenses_user_id_idx on recurring_expenses (user_id);

-- income_sources -----------------------------------------------------------

create table income_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  amount numeric(14, 2) not null,
  frequency income_frequency not null,
  start_date date,
  end_date date,
  expected_date date,
  confidence confidence_level not null default 'likely',
  tax_treatment tax_treatment not null default 'taxable',
  notes text,
  created_at timestamptz not null default now()
);

create index income_sources_user_id_idx on income_sources (user_id);

-- categorization_rules -----------------------------------------------------

create table categorization_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  match_field text not null default 'merchant' check (match_field in ('merchant', 'description')),
  match_operator text not null check (match_operator in ('contains', 'equals')),
  match_value text not null,
  category_id uuid not null references categories (id) on delete cascade,
  subcategory text,
  priority integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index categorization_rules_user_id_priority_idx on categorization_rules (user_id, priority);

-- transactions ---------------------------------------------------------

create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  account_id uuid not null references accounts (id) on delete cascade,
  date date not null,
  posted_date date,
  description text not null,
  merchant text,
  amount numeric(14, 2) not null,
  type transaction_type not null,
  category_id uuid references categories (id) on delete set null,
  subcategory text,
  recurring_expense_id uuid references recurring_expenses (id) on delete set null,
  tags text[] not null default '{}',
  user_notes text,
  import_id text,
  original_description text,
  created_at timestamptz not null default now()
);

create index transactions_user_id_idx on transactions (user_id);
create index transactions_account_id_date_idx on transactions (account_id, date);
create index transactions_category_id_idx on transactions (category_id);

-- Row-level security -----------------------------------------------------

alter table categories enable row level security;
alter table accounts enable row level security;
alter table recurring_expenses enable row level security;
alter table income_sources enable row level security;
alter table categorization_rules enable row level security;
alter table transactions enable row level security;

create policy "categories: owner access" on categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "accounts: owner access" on accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "recurring_expenses: owner access" on recurring_expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "income_sources: owner access" on income_sources
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "categorization_rules: owner access" on categorization_rules
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transactions: owner access" on transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
