import { parseDateOnly } from "@/lib/date";
import { previousOccurrence, type DayOfMonth } from "./day-of-month";

// Per-account "have this period's transactions been entered" status
// (docs/PERSONAL_FINANCE_REQUIREMENTS.md §2 "Account Fields" — due date /
// statement date). An account with a statement_day is expected to have
// transactions entered through that day's most recent occurrence; an account
// without one (checking, savings, cash — no billing cycle) is expected to have
// transactions entered through the end of the previous calendar month.

/** The date an account's transactions are expected to be entered through. */
export function expectedEntryThrough(statementDay: DayOfMonth | null, today: Date): Date {
  // The bar is the most recent close *on or before today*, not a fixed date.
  // accounts.statement_day replaced a one-off statement_date precisely because
  // a stored date only stayed correct for one cycle — and worse, once today
  // fell earlier in the month than that date, the account was measured against
  // a close that had not happened yet.
  //
  // Both branches must produce a *local* midnight, or the fallback (built from
  // local parts) and transactions_entered_through (a date-only column) would be
  // measured on different clocks — see parseDateOnly.
  if (statementDay) return previousOccurrence(statementDay, today);
  return new Date(today.getFullYear(), today.getMonth(), 0);
}

/**
 * Whether transactions_entered_through satisfies expectedEntryThrough.
 * transactions_entered_through is set explicitly by the user (see the
 * "Mark entered" action on the account detail page) — it isn't inferred
 * from the presence of transaction rows, since an account can genuinely
 * have zero transactions in a period.
 */
export function isEntryUpToDate(
  transactionsEnteredThrough: string | null,
  statementDay: DayOfMonth | null,
  today: Date,
): boolean {
  if (!transactionsEnteredThrough) return false;
  return parseDateOnly(transactionsEnteredThrough) >= expectedEntryThrough(statementDay, today);
}
