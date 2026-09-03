// Resolving a stored day-of-month (accounts.due_day / accounts.statement_day)
// against a real calendar month.
//
// A credit card or loan closes and falls due on the *same day every month*, so
// the schema stores that day rather than a one-off date (which goes stale after
// one cycle). Turning it back into a date is the shared primitive underneath
// both the "transactions entered through" status (statement-entry.ts) and the
// bill calendar (calendar.ts).
//
// Every date here is built with `new Date(y, m, d)` — local midnight, matching
// parseDateOnly, and never millisecond arithmetic, which month lengths and DST
// transitions both break. Note this deliberately does *not* use addMonths():
// that helper is setMonth()-based and overflows (Jan 31 + 1 month lands on
// Mar 3), which is exactly what the clamping below exists to prevent.

import { startOfDay } from "@/lib/date";
import type { Period } from "./date-math";

/** A day of the month as stored in accounts.due_day / accounts.statement_day. 1-31. */
export type DayOfMonth = number;

/** Number of days in the given month. Day 0 of the next month is the last day of this one. */
export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * The concrete local-midnight date `day` lands on in the given month, clamped
 * to that month's length — a card that closes on the 31st closes on Feb 28
 * (29 in a leap year), which is what the issuer actually does.
 */
export function resolveDayOfMonth(year: number, monthIndex: number, day: DayOfMonth): Date {
  return new Date(year, monthIndex, Math.min(day, daysInMonth(year, monthIndex)));
}

/**
 * The most recent occurrence of `day` on or before `onOrBefore` (its
 * time-of-day is ignored).
 *
 * The clamp makes this asymmetric on purpose: previousOccurrence(31, Feb 27)
 * is Jan 31, because February's clamped 28th is *after* the 27th — but
 * previousOccurrence(31, Mar 1) is Feb 28.
 */
export function previousOccurrence(day: DayOfMonth, onOrBefore: Date): Date {
  const bound = startOfDay(onOrBefore);
  const thisMonth = resolveDayOfMonth(bound.getFullYear(), bound.getMonth(), day);
  if (thisMonth <= bound) return thisMonth;
  // `new Date(y, -1, d)` rolls back into the previous December on its own.
  return resolveDayOfMonth(bound.getFullYear(), bound.getMonth() - 1, day);
}

/** The next occurrence of `day` on or after `onOrAfter` (its time-of-day is ignored). */
export function nextOccurrence(day: DayOfMonth, onOrAfter: Date): Date {
  const bound = startOfDay(onOrAfter);
  const thisMonth = resolveDayOfMonth(bound.getFullYear(), bound.getMonth(), day);
  if (thisMonth >= bound) return thisMonth;
  // `new Date(y, 12, d)` rolls forward into the next January on its own.
  return resolveDayOfMonth(bound.getFullYear(), bound.getMonth() + 1, day);
}

/**
 * Every occurrence of `day` inside the half-open window — one per calendar
 * month the window touches. Stepping is by month index rather than by adding
 * days, so a clamped day (the 31st) re-expands to the full day in the next
 * long month instead of sticking at 28.
 */
export function dayOfMonthOccurrencesIn(day: DayOfMonth, window: Period): Date[] {
  const dates: Date[] = [];
  const year = window.start.getFullYear();
  // Walk month indices relative to the window's first month; Date normalizes
  // an out-of-range index across the year boundary.
  for (
    let monthIndex = window.start.getMonth();
    new Date(year, monthIndex, 1) < window.end;
    monthIndex++
  ) {
    const occurrence = resolveDayOfMonth(year, monthIndex, day);
    if (occurrence >= window.start && occurrence < window.end) dates.push(occurrence);
  }
  return dates;
}
