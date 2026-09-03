// "A statement has closed and you haven't told us what it said."
//
// The app already knows *when* a cycle closes (accounts.statement_day), so a
// missing statement is derivable rather than stored: resolve the most recent
// close and look for a matching statements row. Pure, like the rest of the
// engine — the pages fetch the rows and pass them in.

import { MS_PER_DAY } from "./date-math";
import { nextOccurrence, previousOccurrence, type DayOfMonth } from "./day-of-month";
import { LIABILITY_ACCOUNT_TYPES } from "./types";

export type StatementAccount = {
  id: string;
  name: string;
  type: string;
  active: boolean;
  statement_day: DayOfMonth | null;
  due_day: DayOfMonth | null;
};

/** A statements row, reduced to what the detector matches on. */
export type RecordedStatement = {
  account_id: string;
  /** ISO date string, "yyyy-mm-dd" (matches statements.closing_date). */
  closing_date: string;
};

export type PendingStatement = {
  accountId: string;
  accountName: string;
  /** Local midnight — the cycle's close. */
  closingDate: Date;
  /** When the payment falls due, or null if the account has no due_day. */
  dueDate: Date | null;
  daysSinceClose: number;
};

// Same key construction as calendar.ts's isoKey. Deliberately not
// toISOString(), which converts to UTC and lands a day early west of
// Greenwich — the bug parseDateOnly exists to prevent.
function isoKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const LIABILITY_TYPES: readonly string[] = LIABILITY_ACCOUNT_TYPES;

/** The next calendar day, built from local parts so month ends roll over correctly. */
function dayAfter(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

/**
 * Accounts whose most recent statement close has no recorded statement.
 *
 * Only the *latest* close is reported, so an account left alone for a year
 * produces one prompt rather than twelve — the older cycles are gone from the
 * user's paperwork anyway, and a backlog nobody can clear is noise.
 */
export function findPendingStatements(input: {
  accounts: readonly StatementAccount[];
  recorded: readonly RecordedStatement[];
  asOfDate: Date;
}): PendingStatement[] {
  const { accounts, recorded, asOfDate } = input;

  const recordedKeys = new Set(
    recorded.map((row) => `${row.account_id}:${row.closing_date}`),
  );

  const pending: PendingStatement[] = [];

  for (const account of accounts) {
    // Only revolving/amortizing debt issues statements; a checking account
    // has no cycle, and an inactive one is not worth chasing.
    if (!account.active) continue;
    if (!account.statement_day) continue;
    if (!LIABILITY_TYPES.includes(account.type)) continue;

    const closingDate = previousOccurrence(account.statement_day, asOfDate);
    if (recordedKeys.has(`${account.id}:${isoKey(closingDate)}`)) continue;

    pending.push({
      accountId: account.id,
      accountName: account.name,
      closingDate,
      // A payment falls due strictly *after* the cycle closes, so the search
      // starts the day after. Without that, an account whose due day equals its
      // statement day would report the payment due the moment the statement
      // closed — and clamping can collide two different days onto the same date
      // anyway (closing on the 30th and due on the 31st both land on Feb 28).
      dueDate: account.due_day
        ? nextOccurrence(account.due_day, dayAfter(closingDate))
        : null,
      daysSinceClose: Math.floor((asOfDate.getTime() - closingDate.getTime()) / MS_PER_DAY),
    });
  }

  // Longest outstanding first — that is the one most likely to be late.
  return pending.sort((a, b) => b.daysSinceClose - a.daysSinceClose);
}
