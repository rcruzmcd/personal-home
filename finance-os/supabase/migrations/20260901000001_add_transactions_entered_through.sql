-- Statement/period entry tracking (docs/PERSONAL_FINANCE_REQUIREMENTS.md §2).
-- accounts.due_date and accounts.statement_date already exist but were never
-- surfaced anywhere in the app; this migration only adds the piece that was
-- actually missing — a way to know whether this month's/statement's
-- transactions have been entered. transactions_entered_through is the date
-- the user has manually confirmed all transactions are entered up through;
-- compared against statement_date (or the previous calendar month end for
-- accounts without a statement cycle) to derive an "up to date" status.

alter table accounts
  add column transactions_entered_through date;
