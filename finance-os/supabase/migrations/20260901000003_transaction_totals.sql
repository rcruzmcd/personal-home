-- Net total for an account's transactions under the same search/timeframe
-- filters the list view applies, so the account header can show "net for
-- this period" without pulling every matching row into the app (which
-- PostgREST's row cap would silently truncate).
--
-- `security invoker` so RLS still scopes rows to the calling user, `stable`
-- so Postgres can reuse the result within a statement. p_query is matched
-- with ilike; callers must escape LIKE wildcards (see escapeLikePattern in
-- src/lib/transactions/list-params.ts).
create function transaction_totals(
  p_account_id uuid,
  p_query text default null,
  p_start date default null,
  p_end date default null
)
returns table (transaction_count bigint, net numeric)
language sql
security invoker
stable
as $$
  select
    count(*)::bigint as transaction_count,
    coalesce(sum(t.amount), 0) as net
  from transactions t
  where t.account_id = p_account_id
    and (
      p_query is null
      or p_query = ''
      or t.description ilike '%' || p_query || '%'
    )
    and (p_start is null or t.date >= p_start)
    and (p_end is null or t.date <= p_end);
$$;

grant execute on function transaction_totals(uuid, text, date, date) to authenticated;
