// Expanding a recurring schedule into the actual dates it lands on inside a
// window. The calendar needs "which days", where the rest of the engine only
// ever needed "how much per period" (see income.ts's projectIncomeForPeriod and
// recurring.ts's monthlyEquivalent).
//
// Deliberately NOT sharing income.ts's private countWeeklyOccurrences: that
// function anchors on `new Date(iso)` — UTC midnight — while everything here
// anchors on parseDateOnly, local midnight. Forcing one helper across both
// clocks would reintroduce the exact off-by-one parseDateOnly exists to
// prevent. (income.ts's UTC anchoring is a real pre-existing bug west of
// Greenwich, but fixing it belongs in its own change with its own test pass.)

import { parseDateOnly } from "@/lib/date";
import type { Period } from "./date-math";
import { dayOfMonthOccurrencesIn, resolveDayOfMonth } from "./day-of-month";
import type { CalcIncomeSource, RecurringFrequency } from "./types";

export type RecurringOccurrenceSource = {
  frequency: RecurringFrequency;
  /** recurring_expenses.next_date — a rolling anchor, so occurrences project backwards as well as forwards. */
  next_date: string | null;
  active: boolean;
};

export type IncomeOccurrenceSource = Pick<
  CalcIncomeSource,
  "frequency" | "expected_date" | "start_date" | "end_date"
>;

/** Every day in [window.start, window.end). */
function everyDayIn(window: Period): Date[] {
  const dates: Date[] = [];
  for (
    let date = window.start;
    date < window.end;
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  ) {
    dates.push(date);
  }
  return dates;
}

/**
 * Occurrences on a 7-day stride from `anchor`. `earliest` bounds the series on
 * the left (the anchor itself for income, which never pays before it starts;
 * unbounded for a recurring expense, whose next_date rolls forward over time
 * and so must still project backwards into an earlier month).
 */
function weeklyOccurrences(
  anchor: Date,
  window: Period,
  { earliest, latest }: { earliest: Date | null; latest: Date | null },
): Date[] {
  const start = earliest && earliest > window.start ? earliest : window.start;
  const stop = latest && latest < window.end ? new Date(latest.getTime() + 1) : window.end;
  if (start >= stop) return [];

  // Jump straight to the first occurrence at/after `start` rather than stepping
  // from an anchor that may be arbitrarily far away in either direction.
  const dayDelta = Math.round(
    (start.getTime() - anchor.getTime()) / (24 * 60 * 60 * 1000),
  );
  const strides = Math.ceil(dayDelta / 7);

  const dates: Date[] = [];
  for (
    let occurrence = new Date(
      anchor.getFullYear(),
      anchor.getMonth(),
      anchor.getDate() + strides * 7,
    );
    occurrence < stop;
    occurrence = new Date(
      occurrence.getFullYear(),
      occurrence.getMonth(),
      occurrence.getDate() + 7,
    )
  ) {
    if (occurrence >= start) dates.push(occurrence);
  }
  return dates;
}

/** The anchor's month/day, once for each year the window touches. */
function annualOccurrences(anchor: Date, window: Period): Date[] {
  const dates: Date[] = [];
  for (let year = window.start.getFullYear(); year <= window.end.getFullYear(); year++) {
    const occurrence = resolveDayOfMonth(year, anchor.getMonth(), anchor.getDate());
    if (occurrence >= window.start && occurrence < window.end) dates.push(occurrence);
  }
  return dates;
}

/** The dates an active recurring expense falls on inside the window, ascending. */
export function recurringOccurrencesIn(
  source: RecurringOccurrenceSource,
  window: Period,
): Date[] {
  if (!source.active || !source.next_date) return [];
  const anchor = parseDateOnly(source.next_date);

  switch (source.frequency) {
    case "daily":
      return everyDayIn(window);
    case "weekly":
      return weeklyOccurrences(anchor, window, { earliest: null, latest: null });
    case "monthly":
      return dayOfMonthOccurrencesIn(anchor.getDate(), window);
    case "annually":
      return annualOccurrences(anchor, window);
    default:
      return [];
  }
}

/** The dates an income source is expected to pay inside the window, ascending. */
export function incomeOccurrencesIn(source: IncomeOccurrenceSource, window: Period): Date[] {
  // Same anchor rule as projectIncomeForPeriod: expected_date for a future or
  // uncertain source, otherwise start_date for one already in progress.
  const anchorValue = source.expected_date ?? source.start_date;
  if (!anchorValue) return [];
  const anchor = parseDateOnly(anchorValue);
  const endBound = source.end_date ? parseDateOnly(source.end_date) : null;
  if (endBound && endBound < window.start) return [];

  switch (source.frequency) {
    case "one_time":
      return anchor >= window.start && anchor < window.end ? [anchor] : [];

    case "weekly":
      // Income never pays before its anchor, so the series is left-bounded —
      // unlike a recurring expense's rolling next_date.
      return weeklyOccurrences(anchor, window, { earliest: anchor, latest: endBound });

    case "monthly":
      return dayOfMonthOccurrencesIn(anchor.getDate(), window).filter(
        (date) => date >= anchor && (!endBound || date <= endBound),
      );

    default:
      return [];
  }
}
