-- accounts.due_date / statement_date were one-off dates, but a credit card or
-- loan closes and falls due on the *same day every month*. A stored date only
-- stayed correct for one cycle; the day of month stays true and is resolved
-- against whatever month is being viewed by src/lib/calculations/day-of-month.ts
-- (which clamps 29/30/31 to the last day of shorter months, the way an issuer
-- actually bills).

alter table accounts add column due_day smallint;
alter table accounts add column statement_day smallint;

update accounts
   set due_day       = extract(day from due_date)::smallint,
       statement_day = extract(day from statement_date)::smallint;

alter table accounts drop column due_date;
alter table accounts drop column statement_date;

-- NULL passes a CHECK (it evaluates to unknown, not false), so "no billing
-- cycle" is still representable — checking/savings/cash carry neither day.
alter table accounts
  add constraint accounts_due_day_range check (due_day between 1 and 31),
  add constraint accounts_statement_day_range check (statement_day between 1 and 31);

comment on column accounts.due_day is
  'Day of month the payment is due (1-31). Resolved against a month and clamped to that month''s length.';
comment on column accounts.statement_day is
  'Day of month the statement closes (1-31). Same clamping rule as due_day.';
