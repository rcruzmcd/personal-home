import { describe, expect, test } from "vitest";
import {
  dayOfMonthOccurrencesIn,
  daysInMonth,
  nextOccurrence,
  previousOccurrence,
  resolveDayOfMonth,
} from "../day-of-month";

describe("daysInMonth", () => {
  test("knows the short months", () => {
    expect(daysInMonth(2026, 1)).toBe(28); // Feb 2026
    expect(daysInMonth(2028, 1)).toBe(29); // Feb 2028, a leap year
    expect(daysInMonth(2026, 3)).toBe(30); // April
    expect(daysInMonth(2026, 0)).toBe(31); // January
  });
});

describe("resolveDayOfMonth", () => {
  test("clamps a day past the month's length to its last day", () => {
    expect(resolveDayOfMonth(2026, 1, 31)).toEqual(new Date(2026, 1, 28));
    expect(resolveDayOfMonth(2028, 1, 31)).toEqual(new Date(2028, 1, 29));
    expect(resolveDayOfMonth(2026, 3, 31)).toEqual(new Date(2026, 3, 30));
  });

  test("leaves a day that fits alone", () => {
    expect(resolveDayOfMonth(2026, 1, 15)).toEqual(new Date(2026, 1, 15));
  });
});

describe("previousOccurrence", () => {
  test("returns today when the day is today", () => {
    expect(previousOccurrence(14, new Date(2026, 8, 14))).toEqual(new Date(2026, 8, 14));
  });

  test("ignores the time of day on the bound", () => {
    expect(previousOccurrence(14, new Date(2026, 8, 14, 23, 59))).toEqual(new Date(2026, 8, 14));
  });

  test("falls back a month when the day is still ahead this month", () => {
    expect(previousOccurrence(14, new Date(2026, 8, 3))).toEqual(new Date(2026, 7, 14));
  });

  test("rolls back across the year boundary", () => {
    expect(previousOccurrence(20, new Date(2026, 0, 5))).toEqual(new Date(2025, 11, 20));
  });

  test("day 31 in early March is February's clamped last day", () => {
    expect(previousOccurrence(31, new Date(2026, 2, 5))).toEqual(new Date(2026, 1, 28));
  });

  test("day 31 mid-February skips back to January, not February's 28th", () => {
    // Feb 28 is *after* Feb 27, so it cannot be the most recent occurrence.
    expect(previousOccurrence(31, new Date(2026, 1, 27))).toEqual(new Date(2026, 0, 31));
  });
});

describe("nextOccurrence", () => {
  test("returns today when the day is today", () => {
    expect(nextOccurrence(14, new Date(2026, 8, 14))).toEqual(new Date(2026, 8, 14));
  });

  test("moves forward a month once the day has passed", () => {
    expect(nextOccurrence(14, new Date(2026, 8, 20))).toEqual(new Date(2026, 9, 14));
  });

  test("rolls forward across the year boundary", () => {
    expect(nextOccurrence(5, new Date(2026, 11, 20))).toEqual(new Date(2027, 0, 5));
  });

  test("day 31 in February clamps to the 28th", () => {
    expect(nextOccurrence(31, new Date(2026, 1, 10))).toEqual(new Date(2026, 1, 28));
  });
});

describe("dayOfMonthOccurrencesIn", () => {
  test("yields exactly one date for a single-month window", () => {
    const window = { start: new Date(2026, 8, 1), end: new Date(2026, 9, 1) };
    expect(dayOfMonthOccurrencesIn(14, window)).toEqual([new Date(2026, 8, 14)]);
  });

  test("re-expands a clamped day in the following long month", () => {
    // Jan 31 / Feb 28 / Mar 31 — the 31st must not stick at 28 after February.
    const window = { start: new Date(2026, 0, 1), end: new Date(2026, 3, 1) };
    expect(dayOfMonthOccurrencesIn(31, window)).toEqual([
      new Date(2026, 0, 31),
      new Date(2026, 1, 28),
      new Date(2026, 2, 31),
    ]);
  });

  test("crosses the year boundary", () => {
    const window = { start: new Date(2026, 11, 1), end: new Date(2027, 1, 1) };
    expect(dayOfMonthOccurrencesIn(10, window)).toEqual([
      new Date(2026, 11, 10),
      new Date(2027, 0, 10),
    ]);
  });

  test("excludes occurrences outside a window that starts mid-month", () => {
    const window = { start: new Date(2026, 8, 20), end: new Date(2026, 9, 20) };
    expect(dayOfMonthOccurrencesIn(14, window)).toEqual([new Date(2026, 9, 14)]);
  });

  test("is empty when the day never falls inside the window", () => {
    const window = { start: new Date(2026, 8, 2), end: new Date(2026, 8, 10) };
    expect(dayOfMonthOccurrencesIn(20, window)).toEqual([]);
  });
});
