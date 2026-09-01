-- RLS policies only govern row *visibility* — Postgres still requires
-- table-level GRANTs before the `authenticated` role can touch these
-- tables at all. Without this, every insert/update/delete fails with
-- "permission denied for table X" regardless of the RLS policy.
grant usage on schema public to authenticated;

grant select, insert, update, delete on
  categories, accounts, recurring_expenses, income_sources, categorization_rules, transactions
to authenticated;

-- Cover tables added by future migrations (which run as the `postgres`
-- role) without needing another grants migration each time.
alter default privileges for role postgres in schema public
  grant select, insert, update, delete on tables to authenticated;
