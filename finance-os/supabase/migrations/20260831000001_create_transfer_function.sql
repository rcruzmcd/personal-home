-- Transfers between the user's own accounts must not count as spending
-- (docs/PERSONAL_FINANCE_REQUIREMENTS.md §3, "Critical"). Modeled as two
-- transaction rows — a negative leg on the source account and a positive
-- leg on the destination account, both type='transfer' — so each account's
-- ledger stays self-contained and downstream spend calculations can drop
-- type='transfer' rows outright instead of needing to net them out.
--
-- security invoker so RLS still applies using the calling user's
-- privileges; both inserts run as part of the single function call, which
-- Postgres treats as one atomic statement.
create function create_transfer(
  p_from_account uuid,
  p_to_account uuid,
  p_amount numeric,
  p_date date,
  p_description text
) returns void
language plpgsql
security invoker
as $$
begin
  insert into transactions (user_id, account_id, date, description, amount, type)
  values (auth.uid(), p_from_account, p_date, p_description, -abs(p_amount), 'transfer');

  insert into transactions (user_id, account_id, date, description, amount, type)
  values (auth.uid(), p_to_account, p_date, p_description, abs(p_amount), 'transfer');
end;
$$;

grant execute on function create_transfer(uuid, uuid, numeric, date, text) to authenticated;
