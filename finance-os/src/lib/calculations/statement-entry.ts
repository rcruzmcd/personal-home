import { parseDateOnly } from "@/lib/date";

// Per-account "have this period's transactions been entered" status
// (docs/PERSONAL_FINANCE_REQUIREMENTS.md §2 "Account Fields" — due date /
// statement date). An account with a statement_date is expected to have
// transactions entered through that date; an account without one (checking,
// savings, cash — no billing cycle) is expected to have transactions
// entered through the end of the previous calendar month.

/** The date an account's transactions are expected to be entered through. */
export function expectedEntryThrough(statementDate: string | null, today: Date): Date {
  // Both branches must produce a *local* midnight, or the fallback (built
  // from local parts) and the statement date (a date-only column) would be
  // measured on different clocks — see parseDateOnly.
  if (statementDate) return parseDateOnly(statementDate);
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
  statementDate: string | null,
  today: Date,
): boolean {
  if (!transactionsEnteredThrough) return false;
  return parseDateOnly(transactionsEnteredThrough) >= expectedEntryThrough(statementDate, today);
}
