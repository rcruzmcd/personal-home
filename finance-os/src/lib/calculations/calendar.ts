// One event model for the bill calendar (/calendar). Everything dated that the
// app knows about — account due days, statement closes, recurring expenses and
// expected income — collapses into a single sorted CalendarEvent[], which both
// the month grid and the mobile agenda render, so the two views cannot disagree.
//
// Pure, like the rest of src/lib/calculations: the route fetches rows and
// passes them in.

import { startOfDay } from "@/lib/date";
import type { Period } from "./date-math";
import { dayOfMonthOccurrencesIn, type DayOfMonth } from "./day-of-month";
import { incomeOccurrencesIn, recurringOccurrencesIn } from "./occurrences";
import type { IncomeFrequency, RecurringFrequency } from "./types";

export const CALENDAR_EVENT_KINDS = ["due", "statement", "recurring", "income"] as const;
export type CalendarEventKind = (typeof CALENDAR_EVENT_KINDS)[number];

export type CalendarEvent = {
  /** Stable key: a weekly source hits the same month several times. */
  id: string;
  kind: CalendarEventKind;
  /** Local midnight. */
  date: Date;
  label: string;
  /** Positive magnitude, or null where there is no figure — a statement close is a date, not an amount. */
  amount: number | null;
  href: string | null;
};

export type CalendarAccount = {
  id: string;
  name: string;
  active: boolean;
  due_day: DayOfMonth | null;
  statement_day: DayOfMonth | null;
  minimum_payment: number | null;
};

export type CalendarRecurringExpense = {
  id: string;
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  next_date: string | null;
  active: boolean;
};

export type CalendarIncomeSource = {
  id: string;
  name: string;
  amount: number;
  frequency: IncomeFrequency;
  expected_date: string | null;
  start_date: string | null;
  end_date: string | null;
};

/** Half-open [1st of month, 1st of next month). `month` is 1-12, matching periods.ts and the URL. */
export function monthWindow(year: number, month: number): Period {
  // `new Date(y, 12, 1)` normalizes into the next January on its own.
  return { start: new Date(year, month - 1, 1), end: new Date(year, month, 1) };
}

function isoKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// Ties on a day resolve in the order the money matters: what's owed, then what
// closed, then the standing outgoings, then what comes in.
const KIND_ORDER: Record<CalendarEventKind, number> = {
  due: 0,
  statement: 1,
  recurring: 2,
  income: 3,
};

function compareEvents(a: CalendarEvent, b: CalendarEvent): number {
  const byDate = a.date.getTime() - b.date.getTime();
  if (byDate !== 0) return byDate;
  const byKind = KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
  if (byKind !== 0) return byKind;
  // Largest first, with the amount-less events after the priced ones.
  const byAmount = (b.amount ?? -Infinity) - (a.amount ?? -Infinity);
  if (byAmount !== 0 && Number.isFinite(byAmount)) return byAmount;
  return a.label.localeCompare(b.label);
}

export function buildMonthEvents(input: {
  accounts: readonly CalendarAccount[];
  recurringExpenses: readonly CalendarRecurringExpense[];
  incomeSources: readonly CalendarIncomeSource[];
  window: Period;
}): CalendarEvent[] {
  const { accounts, recurringExpenses, incomeSources, window } = input;
  const events: CalendarEvent[] = [];

  for (const account of accounts) {
    if (!account.active) continue;
    const href = `/accounts/${account.id}`;

    if (account.due_day) {
      for (const date of dayOfMonthOccurrencesIn(account.due_day, window)) {
        events.push({
          id: `due:${account.id}:${isoKey(date)}`,
          kind: "due",
          date,
          label: account.name,
          amount: account.minimum_payment,
          href,
        });
      }
    }

    if (account.statement_day) {
      for (const date of dayOfMonthOccurrencesIn(account.statement_day, window)) {
        events.push({
          id: `statement:${account.id}:${isoKey(date)}`,
          kind: "statement",
          date,
          label: `${account.name} closes`,
          amount: null,
          href,
        });
      }
    }
  }

  for (const expense of recurringExpenses) {
    for (const date of recurringOccurrencesIn(expense, window)) {
      events.push({
        id: `recurring:${expense.id}:${isoKey(date)}`,
        kind: "recurring",
        date,
        label: expense.name,
        amount: expense.amount,
        href: `/recurring/${expense.id}/edit`,
      });
    }
  }

  for (const source of incomeSources) {
    for (const date of incomeOccurrencesIn(source, window)) {
      events.push({
        id: `income:${source.id}:${isoKey(date)}`,
        kind: "income",
        date,
        label: source.name,
        amount: source.amount,
        href: `/income/${source.id}/edit`,
      });
    }
  }

  return events.sort(compareEvents);
}

/**
 * Total for ONE kind of event.
 *
 * Per-kind on purpose — never sum `due` and `recurring` into a single "bills"
 * figure. The same obligation legitimately appears as both: a mortgage is an
 * account with a minimum_payment *and* a tracked recurring expense (it is
 * exactly that in the demo data), so a combined total would double-count it.
 */
export function sumEventAmounts(
  events: readonly CalendarEvent[],
  kind: CalendarEventKind,
): number {
  return events
    .filter((event) => event.kind === kind)
    .reduce((sum, event) => sum + (event.amount ?? 0), 0);
}

export type CalendarDay = {
  date: Date;
  /** False for the leading/trailing cells borrowed from the adjacent months. */
  inMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  events: CalendarEvent[];
};

/**
 * Week-aligned cells (Sunday-first) covering the window's month — 28/35/42
 * entries, always whole rows, so the grid never renders a ragged last week.
 * Padding cells are real days from the neighbouring months but carry no events:
 * the window they were built from excludes them.
 */
export function buildMonthGrid(
  window: Period,
  events: readonly CalendarEvent[],
  today: Date,
): CalendarDay[] {
  const eventsByDay = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = isoKey(event.date);
    const existing = eventsByDay.get(key);
    if (existing) existing.push(event);
    else eventsByDay.set(key, [event]);
  }

  const todayStart = startOfDay(today);
  const firstCell = new Date(
    window.start.getFullYear(),
    window.start.getMonth(),
    window.start.getDate() - window.start.getDay(),
  );

  const days: CalendarDay[] = [];
  for (let cell = firstCell; days.length % 7 !== 0 || cell < window.end; ) {
    days.push({
      date: cell,
      inMonth: cell >= window.start && cell < window.end,
      isToday: cell.getTime() === todayStart.getTime(),
      isPast: cell < todayStart,
      events: eventsByDay.get(isoKey(cell)) ?? [],
    });
    cell = new Date(cell.getFullYear(), cell.getMonth(), cell.getDate() + 1);
  }
  return days;
}
