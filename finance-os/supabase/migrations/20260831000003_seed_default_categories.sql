-- Starter category list (docs/PERSONAL_FINANCE_REQUIREMENTS.md §4). Names
-- match DEFAULT_ESSENTIAL_CATEGORIES in src/lib/calculations/categories.ts
-- exactly, since essential/discretionary is decided by name match there.
--
-- Seeded per-user (not globally) because categories carries user_id + RLS,
-- so both the private and showcase instances need their own rows. A
-- trigger seeds new signups; the DO block backfills any user created
-- before this migration.

create function seed_default_categories(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into categories (user_id, name, type, position)
  select p_user_id, defaults.name, defaults.type::category_type, defaults.position
  from (values
    ('Housing', 'expense', 0),
    ('Food', 'expense', 1),
    ('Transportation', 'expense', 2),
    ('Insurance', 'expense', 3),
    ('Healthcare', 'expense', 4),
    ('Phone/Internet', 'expense', 5),
    ('Childcare', 'expense', 6),
    ('Dining Out', 'expense', 7),
    ('Entertainment', 'expense', 8),
    ('Shopping', 'expense', 9),
    ('Subscriptions', 'expense', 10),
    ('Personal Care', 'expense', 11),
    ('Fitness', 'expense', 12),
    ('Savings Transfer', 'transfer', 13),
    ('Investment', 'transfer', 14),
    ('Salary', 'income', 15),
    ('Severance', 'income', 16),
    ('Unemployment', 'income', 17),
    ('Freelance', 'income', 18),
    ('Other Income', 'income', 19)
  ) as defaults(name, type, position)
  where not exists (
    select 1 from categories c
    where c.user_id = p_user_id and c.name = defaults.name
  );
end;
$$;

create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform seed_default_categories(new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

do $$
declare
  existing_user record;
begin
  for existing_user in select id from auth.users loop
    perform seed_default_categories(existing_user.id);
  end loop;
end;
$$;
