-- Helpers for browsing/filtering transactions.
--
-- Both are `security invoker` so RLS still scopes rows to the calling user,
-- and `stable` so Postgres can reuse the result within a statement.

-- Year/month buckets for an account's transactions, optionally narrowed by
-- the same description search the list view applies. Aggregating in the
-- database keeps the period navigation O(periods) instead of pulling every
-- transaction date into the app just to bucket it (and avoids PostgREST's
-- row cap silently truncating the range).
--
-- p_query is matched with ilike; callers must escape LIKE wildcards
-- (see escapeLikePattern in src/lib/transactions/list-params.ts) so a user
-- typing "%" searches for a literal percent sign.
create function transaction_periods(p_account_id uuid, p_query text default null)
returns table (year integer, month integer, transaction_count bigint)
language sql
security invoker
stable
as $$
  select
    extract(year from t.date)::integer as year,
    extract(month from t.date)::integer as month,
    count(*)::bigint as transaction_count
  from transactions t
  where t.account_id = p_account_id
    and (
      p_query is null
      or p_query = ''
      or t.description ilike '%' || p_query || '%'
    )
  group by 1, 2
  order by 1 desc, 2 desc;
$$;

grant execute on function transaction_periods(uuid, text) to authenticated;

-- Per-account transaction counts, so the account/transaction list screens
-- can show how many rows a "delete all transactions" action would remove
-- without issuing one count query per account.
create function transaction_counts_by_account()
returns table (account_id uuid, transaction_count bigint)
language sql
security invoker
stable
as $$
  select t.account_id, count(*)::bigint as transaction_count
  from transactions t
  group by 1;
$$;

grant execute on function transaction_counts_by_account() to authenticated;
