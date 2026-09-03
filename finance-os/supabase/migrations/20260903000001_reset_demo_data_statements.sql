-- Seeds the statements table in the demo data (added by
-- 20260903000000_create_statements.sql).
--
-- A full copy of reset_demo_data() rather than an edit to
-- 20260902000003_reset_demo_data_day_of_month.sql, for the same reason that one
-- was a full copy: the original 20260902000000 declares the function with a
-- bare `create function` and self-executes, so editing an applied migration in
-- place breaks a fresh `supabase db reset`. The later definition wins.
--
-- The statements table needs no entry in a delete list: this function opens by
-- deleting the demo auth.users row, and statements.user_id cascades from it.

create or replace function reset_demo_data() returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_user_id uuid := '00000000-0000-0000-0000-000000000001';

  -- Category ids, fetched after insert (seed_default_categories runs via
  -- the on_auth_user_created trigger — see
  -- supabase/migrations/20260831000001_create_transfer_function.sql).
  v_cat_housing uuid;
  v_cat_food uuid;
  v_cat_transportation uuid;
  v_cat_insurance uuid;
  v_cat_healthcare uuid;
  v_cat_phone uuid;
  v_cat_dining uuid;
  v_cat_entertainment uuid;
  v_cat_shopping uuid;
  v_cat_subscriptions uuid;
  v_cat_personal_care uuid;
  v_cat_fitness uuid;
  v_cat_savings_transfer uuid;
  v_cat_salary uuid;

  -- Account ids, captured on insert so transactions/transfers below can
  -- reference them directly instead of repeating name lookups.
  v_acct_checking uuid;
  v_acct_savings uuid;
  v_acct_cash uuid;
  v_acct_brokerage uuid;
  v_acct_retirement uuid;
  v_acct_other_asset uuid;
  v_acct_cc_sapphire uuid;
  v_amex_close date;
  v_acct_cc_amex uuid;
  v_acct_personal_loan uuid;
  v_acct_student_loan uuid;
  v_acct_auto_loan uuid;
  v_acct_mortgage uuid;
  v_acct_other_liability uuid;
begin

  -- Auth user -------------------------------------------------------------
  -- Every column GoTrue reads back on login is set explicitly (rather than
  -- left null) to avoid the well-known "converting NULL to string" error
  -- it throws on manually inserted rows that skip these text columns.
  delete from auth.users where email = 'demo@example.com';

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, created_at, updated_at, phone, phone_confirmed_at,
    phone_change, phone_change_token, phone_change_sent_at,
    email_change_token_current, email_change_confirm_status,
    is_sso_user, is_anonymous
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_user_id,
    'authenticated',
    'authenticated',
    'demo@example.com',
    crypt('devpassword123', gen_salt('bf')),
    now(), null, '', null,
    '', null, '', '',
    null, now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    false, now(), now(), null, null,
    '', '', null,
    '', 0,
    false, false
  );

  insert into auth.identities (
    id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at
  ) values (
    gen_random_uuid(), v_user_id, v_user_id::text, 'email',
    jsonb_build_object('sub', v_user_id::text, 'email', 'demo@example.com', 'email_verified', true),
    now(), now(), now()
  );

  select id into v_cat_housing from categories where user_id = v_user_id and name = 'Housing';
  select id into v_cat_food from categories where user_id = v_user_id and name = 'Food';
  select id into v_cat_transportation from categories where user_id = v_user_id and name = 'Transportation';
  select id into v_cat_insurance from categories where user_id = v_user_id and name = 'Insurance';
  select id into v_cat_healthcare from categories where user_id = v_user_id and name = 'Healthcare';
  select id into v_cat_phone from categories where user_id = v_user_id and name = 'Phone/Internet';
  select id into v_cat_dining from categories where user_id = v_user_id and name = 'Dining Out';
  select id into v_cat_entertainment from categories where user_id = v_user_id and name = 'Entertainment';
  select id into v_cat_shopping from categories where user_id = v_user_id and name = 'Shopping';
  select id into v_cat_subscriptions from categories where user_id = v_user_id and name = 'Subscriptions';
  select id into v_cat_personal_care from categories where user_id = v_user_id and name = 'Personal Care';
  select id into v_cat_fitness from categories where user_id = v_user_id and name = 'Fitness';
  select id into v_cat_savings_transfer from categories where user_id = v_user_id and name = 'Savings Transfer';
  select id into v_cat_salary from categories where user_id = v_user_id and name = 'Salary';

  -- Accounts ----------------------------------------------------------------
  -- One of every account_type (docs/PERSONAL_FINANCE_REQUIREMENTS.md §2), so
  -- the accounts list, dashboard net-worth breakdown, and debt fields all
  -- have something to render for every branch.

  insert into accounts (user_id, name, institution, type, balance, active, opening_date)
  values (v_user_id, 'Chase Checking', 'Chase', 'checking', 5420.00, true, current_date - interval '2 years')
  returning id into v_acct_checking;

  insert into accounts (user_id, name, institution, type, balance, active, opening_date)
  values (v_user_id, 'Ally Online Savings', 'Ally', 'savings', 3000.00, true, current_date - interval '2 years')
  returning id into v_acct_savings;

  insert into accounts (user_id, name, institution, type, balance, active, opening_date)
  values (v_user_id, 'Cash on hand', null, 'cash', 200.00, true, current_date - interval '2 years')
  returning id into v_acct_cash;

  insert into accounts (user_id, name, institution, type, balance, active, opening_date)
  values (v_user_id, 'Fidelity Brokerage', 'Fidelity', 'brokerage', 3200.00, true, current_date - interval '4 years')
  returning id into v_acct_brokerage;

  insert into accounts (user_id, name, institution, type, balance, active, opening_date)
  values (v_user_id, 'Vanguard 401k', 'Vanguard', 'retirement', 18400.00, true, current_date - interval '6 years')
  returning id into v_acct_retirement;

  insert into accounts (user_id, name, institution, type, balance, active, opening_date, notes)
  values (v_user_id, 'Former Employer RSUs', null, 'other_asset', 1500.00, true, current_date - interval '1 year', 'Vested but unsold shares from PriorCo.')
  returning id into v_acct_other_asset;

  insert into accounts (
    user_id, name, institution, type, balance, active, opening_date,
    credit_limit, interest_rate, minimum_payment, due_day, statement_day
  ) values (
    v_user_id, 'Chase Sapphire Reserve', 'Chase', 'credit_card', 7250.00, true, current_date - interval '3 years',
    12000.00, 24.99, 215.00, 14, 17
  )
  returning id into v_acct_cc_sapphire;

  insert into accounts (
    user_id, name, institution, type, balance, active, opening_date,
    credit_limit, interest_rate, minimum_payment, due_day, statement_day
  ) values (
    v_user_id, 'Amex Blue Cash', 'American Express', 'credit_card', 24250.00, true, current_date - interval '5 years',
    26000.00, 22.99, 610.00, 3, 28
  )
  returning id into v_acct_cc_amex;

  insert into accounts (
    user_id, name, institution, type, balance, active, opening_date,
    interest_rate, minimum_payment, original_principal, remaining_principal, loan_term_months
  ) values (
    v_user_id, 'SoFi Personal Loan', 'SoFi', 'personal_loan', 12000.00, true, current_date - interval '1 year',
    11.5, 250.00, 15000.00, 12000.00, 60
  )
  returning id into v_acct_personal_loan;

  insert into accounts (
    user_id, name, institution, type, balance, active, opening_date,
    interest_rate, minimum_payment, original_principal, remaining_principal, loan_term_months
  ) values (
    v_user_id, 'Navient Student Loan', 'Navient', 'student_loan', 10970.00, true, current_date - interval '8 years',
    5.0, 165.00, 20000.00, 10970.00, 120
  )
  returning id into v_acct_student_loan;

  insert into accounts (
    user_id, name, institution, type, balance, active, opening_date,
    interest_rate, minimum_payment, original_principal, remaining_principal, loan_term_months, due_day
  ) values (
    v_user_id, 'Toyota Auto Loan', 'Toyota Financial', 'auto_loan', 9800.00, true, current_date - interval '2 years',
    6.9, 310.00, 24000.00, 9800.00, 72, 31
  )
  returning id into v_acct_auto_loan;

  insert into accounts (
    user_id, name, institution, type, balance, active, opening_date,
    interest_rate, minimum_payment, original_principal, remaining_principal, loan_term_months, due_day
  ) values (
    v_user_id, 'Home Mortgage', 'Rocket Mortgage', 'mortgage', 285000.00, true, current_date - interval '4 years',
    6.25, 1850.00, 310000.00, 285000.00, 360, 1
  )
  returning id into v_acct_mortgage;

  insert into accounts (user_id, name, institution, type, balance, active, opening_date, notes)
  values (v_user_id, 'Owed to a friend', null, 'other_liability', 500.00, true, current_date - interval '3 months', 'Borrowed for a car repair, paying back informally.')
  returning id into v_acct_other_liability;

  -- Income sources ------------------------------------------------------
  -- Mirrors docs/PERSONAL_FINANCE_REQUIREMENTS.md §7's worked example
  -- (salary that just ended, a certain severance payout, likely
  -- unemployment benefits) plus one lower-confidence freelance lead.

  insert into income_sources (user_id, name, amount, frequency, start_date, end_date, confidence, tax_treatment, notes)
  values (v_user_id, 'ADP Salary', 6500.00, 'monthly', current_date - interval '8 months', current_date - interval '2 months', 'certain', 'taxable', 'Base salary while employed at PriorCo.');

  insert into income_sources (user_id, name, amount, frequency, expected_date, confidence, tax_treatment, notes)
  values (v_user_id, 'Severance', 42000.00, 'one_time', current_date + interval '5 days', 'certain', 'taxable', 'Lump-sum severance payout from PriorCo.');

  insert into income_sources (user_id, name, amount, frequency, expected_date, end_date, confidence, tax_treatment, notes)
  values (v_user_id, 'Unemployment', 825.00, 'weekly', current_date, current_date + interval '26 weeks', 'likely', 'taxable', 'CA EDD unemployment benefits, 26-week duration.');

  insert into income_sources (user_id, name, amount, frequency, expected_date, confidence, tax_treatment, notes)
  values (v_user_id, 'Freelance Web Project', 2500.00, 'one_time', current_date + interval '45 days', 'possible', 'taxable', 'Potential contract gig, not yet confirmed.');

  -- Categorization rules --------------------------------------------------
  -- Matches the worked examples in docs/PERSONAL_FINANCE_REQUIREMENTS.md §4.

  insert into categorization_rules (user_id, match_field, match_operator, match_value, category_id, subcategory, priority)
  values
    (v_user_id, 'merchant', 'contains', 'UBER', v_cat_transportation, 'Rideshare', 10),
    (v_user_id, 'merchant', 'contains', 'LYFT', v_cat_transportation, 'Rideshare', 10),
    (v_user_id, 'merchant', 'equals', 'Netflix', v_cat_entertainment, 'Streaming', 10),
    (v_user_id, 'merchant', 'equals', 'Spotify', v_cat_entertainment, 'Streaming', 10),
    (v_user_id, 'merchant', 'contains', 'WHOLE FOODS', v_cat_food, 'Groceries', 10),
    (v_user_id, 'merchant', 'contains', 'TRADER JOE', v_cat_food, 'Groceries', 10),
    (v_user_id, 'merchant', 'contains', 'STARBUCKS', v_cat_dining, 'Coffee', 10);

  -- Recurring expenses ------------------------------------------------------
  -- No UI yet (docs/PERSONAL_FINANCE_REQUIREMENTS.md §10 is a "nice to
  -- have"), but seeded so the table has data whenever that screen is built.

  insert into recurring_expenses (user_id, name, merchant, amount, frequency, next_date, category_id, account_id, last_occurrence, occurrences_count)
  values
    (v_user_id, 'Home Mortgage', 'Rocket Mortgage', 1850.00, 'monthly', date_trunc('month', current_date) + interval '1 month', v_cat_housing, v_acct_checking, date_trunc('month', current_date), 4),
    (v_user_id, 'Health Insurance', 'Kaiser Permanente', 195.00, 'monthly', date_trunc('month', current_date) + interval '1 month' + interval '4 days', v_cat_insurance, v_acct_checking, date_trunc('month', current_date), 4),
    (v_user_id, 'Netflix', 'Netflix', 20.00, 'monthly', date_trunc('month', current_date) + interval '1 month' + interval '11 days', v_cat_entertainment, v_acct_checking, date_trunc('month', current_date), 4),
    (v_user_id, 'Spotify', 'Spotify', 12.00, 'monthly', date_trunc('month', current_date) + interval '1 month' + interval '17 days', v_cat_entertainment, v_acct_checking, date_trunc('month', current_date), 4),
    (v_user_id, 'Gym Membership', '24 Hour Fitness', 50.00, 'monthly', date_trunc('month', current_date) + interval '1 month' + interval '23 days', v_cat_fitness, v_acct_checking, date_trunc('month', current_date), 4);

  -- Statements --------------------------------------------------------------
  -- Amex (closes the 28th) has its most recent statement on file; Chase
  -- Sapphire (closes the 17th) deliberately does not, so the demo shows both
  -- states and the "record this statement" prompt has something to point at.

  -- The most recent 28th on or before today, and the first 3rd after it —
  -- matching what previousOccurrence/nextOccurrence derive in
  -- src/lib/calculations/statements.ts. Day 28 exists in every month, so no
  -- clamp is needed here.
  v_amex_close := case
    when extract(day from current_date) >= 28
      then date_trunc('month', current_date)::date + 27
      else (date_trunc('month', current_date) - interval '1 month')::date + 27
  end;

  insert into statements (
    user_id, account_id, closing_date, due_date, statement_balance, minimum_payment, notes
  ) values (
    v_user_id, v_acct_cc_amex,
    v_amex_close,
    (date_trunc('month', v_amex_close) + interval '1 month')::date + 2,
    24250.00, 610.00, 'Autopay set to the minimum.'
  );

  -- Transactions ------------------------------------------------------------
  -- ~4 months of history (current_date and the 3 months prior) so cash
  -- runway/forecast's default 3-month burn lookback and the dashboard's
  -- 120-day transaction fetch both have full windows to average over.

  -- Fixed monthly bills, once per month for the last 4 months.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, bill.description, bill.merchant, bill.amount, 'expense', bill.category_id, bill.subcategory
  from generate_series(date_trunc('month', current_date) - interval '3 months', date_trunc('month', current_date), interval '1 month') as d
  cross join (values
    ('Home Mortgage Payment', 'Rocket Mortgage', -1850.00, v_cat_housing, 'Mortgage'),
    ('Electric & Gas', 'PG&E', -142.50, v_cat_housing, 'Utilities'),
    ('Internet & Phone', 'Verizon', -135.00, v_cat_phone, null),
    ('Health Insurance Premium', 'Kaiser Permanente', -195.00, v_cat_insurance, 'Health'),
    ('Auto Insurance Premium', 'Geico', -120.00, v_cat_insurance, 'Auto'),
    ('Netflix', 'Netflix', -20.00, v_cat_entertainment, 'Streaming'),
    ('Spotify', 'Spotify', -12.00, v_cat_entertainment, 'Streaming'),
    ('Adobe Creative Cloud', 'Adobe', -54.99, v_cat_subscriptions, 'Software'),
    ('Gym Membership', '24 Hour Fitness', -50.00, v_cat_fitness, null)
  ) as bill(description, merchant, amount, category_id, subcategory);

  -- Groceries, every ~5 days.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, m.name, m.name, -round((60 + random() * 100)::numeric, 2), 'expense', v_cat_food, 'Groceries'
  from generate_series(current_date - interval '119 days', current_date, interval '5 days') as d
  cross join lateral (select (array['Whole Foods Market', 'Trader Joes', 'Safeway'])[1 + floor(random() * 3)::int] as name) m;

  -- Dining out, every ~4 days.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, m.name, m.name, -round((12 + random() * 55)::numeric, 2), 'expense', v_cat_dining, 'Restaurants'
  from generate_series(current_date - interval '119 days', current_date, interval '4 days') as d
  cross join lateral (select (array['Chipotle', 'Starbucks', 'Sweetgreen', 'The Local Diner'])[1 + floor(random() * 4)::int] as name) m;

  -- Transportation (rideshare + gas), every ~6 days.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, m.name, m.name, -round((15 + random() * 35)::numeric, 2), 'expense', v_cat_transportation,
    case when m.name in ('Uber', 'Lyft') then 'Rideshare' else 'Gas' end
  from generate_series(current_date - interval '119 days', current_date, interval '6 days') as d
  cross join lateral (select (array['Uber', 'Lyft', 'Shell', 'Chevron'])[1 + floor(random() * 4)::int] as name) m;

  -- Shopping, every ~9 days.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, m.name, m.name, -round((20 + random() * 130)::numeric, 2), 'expense', v_cat_shopping, null
  from generate_series(current_date - interval '119 days', current_date, interval '9 days') as d
  cross join lateral (select (array['Amazon', 'Target', 'Nike'])[1 + floor(random() * 3)::int] as name) m;

  -- Entertainment (one-off outings), every ~13 days.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, m.name, m.name, -round((15 + random() * 45)::numeric, 2), 'expense', v_cat_entertainment, null
  from generate_series(current_date - interval '119 days', current_date, interval '13 days') as d
  cross join lateral (select (array['AMC Theatres', 'Steam', 'Ticketmaster'])[1 + floor(random() * 3)::int] as name) m;

  -- Personal care, every ~21 days.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, m.name, m.name, -round((20 + random() * 60)::numeric, 2), 'expense', v_cat_personal_care, null
  from generate_series(current_date - interval '119 days', current_date, interval '21 days') as d
  cross join lateral (select (array['Great Clips', 'Sephora'])[1 + floor(random() * 2)::int] as name) m;

  -- Healthcare, every ~30 days.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  select v_user_id, v_acct_checking, d::date, 'CVS Pharmacy', 'CVS Pharmacy', -round((15 + random() * 65)::numeric, 2), 'expense', v_cat_healthcare, null
  from generate_series(current_date - interval '119 days', current_date, interval '30 days') as d;

  -- Actual salary deposits for the months it was still being paid
  -- (income_sources.end_date above is 2 months ago).
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id)
  select v_user_id, v_acct_checking, d::date, 'ADP Payroll Deposit', 'ADP', 6500.00, 'income', v_cat_salary
  from generate_series(current_date - interval '4 months', current_date - interval '2 months', interval '1 month') as d;

  -- A couple of refunds and manual adjustments for UI coverage.
  insert into transactions (user_id, account_id, date, description, merchant, amount, type, category_id, subcategory)
  values
    (v_user_id, v_acct_checking, current_date - interval '42 days', 'Amazon Return', 'Amazon', 45.20, 'refund', v_cat_shopping, null),
    (v_user_id, v_acct_checking, current_date - interval '87 days', 'Target Return', 'Target', 18.75, 'refund', v_cat_shopping, null);

  insert into transactions (user_id, account_id, date, description, amount, type, user_notes)
  values
    (v_user_id, v_acct_checking, current_date - interval '60 days', 'Balance correction', 12.50, 'adjustment', 'Rounding difference found during reconciliation.'),
    (v_user_id, v_acct_cash, current_date - interval '25 days', 'Cash count correction', -8.00, 'adjustment', 'Recounted cash on hand.');

  -- Transfers between the user's own accounts — two linked legs each,
  -- exactly matching create_transfer() in
  -- supabase/migrations/20260831000001_create_transfer_function.sql (that
  -- function reads auth.uid(), which isn't set in this context, so the
  -- legs are inserted directly instead of calling it).

  insert into transactions (user_id, account_id, date, description, amount, type)
  select v_user_id, v_acct_checking, d::date, 'Transfer to savings', -500.00, 'transfer'
  from generate_series(current_date - interval '2 months', current_date, interval '1 month') as d;
  insert into transactions (user_id, account_id, date, description, amount, type)
  select v_user_id, v_acct_savings, d::date, 'Transfer to savings', 500.00, 'transfer'
  from generate_series(current_date - interval '2 months', current_date, interval '1 month') as d;

  insert into transactions (user_id, account_id, date, description, amount, type)
  select v_user_id, v_acct_checking, d::date, 'Chase Sapphire payment', -215.00, 'transfer'
  from generate_series(current_date - interval '1 month', current_date, interval '1 month') as d;
  insert into transactions (user_id, account_id, date, description, amount, type)
  select v_user_id, v_acct_cc_sapphire, d::date, 'Chase Sapphire payment', 215.00, 'transfer'
  from generate_series(current_date - interval '1 month', current_date, interval '1 month') as d;

  insert into transactions (user_id, account_id, date, description, amount, type)
  select v_user_id, v_acct_checking, d::date, 'Amex Blue Cash payment', -610.00, 'transfer'
  from generate_series(current_date - interval '1 month', current_date, interval '1 month') as d;
  insert into transactions (user_id, account_id, date, description, amount, type)
  select v_user_id, v_acct_cc_amex, d::date, 'Amex Blue Cash payment', 610.00, 'transfer'
  from generate_series(current_date - interval '1 month', current_date, interval '1 month') as d;

end;
$$;

-- Postgres grants EXECUTE to PUBLIC by default on new functions — revoke
-- that so this can't be triggered by anyone holding only the anon/
-- publishable key, then grant it back only to the role migrations run as.
revoke all on function reset_demo_data() from public;
grant execute on function reset_demo_data() to postgres;

-- Provision the demo user immediately on push, same pattern as the
-- backfill DO block at the bottom of 20260831000003_seed_default_categories.sql.
select reset_demo_data();
