import { describe, expect, test } from "vitest";
import { parseDateOnly, startOfDay } from "../date";

describe("parseDateOnly", () => {
  test("reads a date-only column as local midnight, not UTC midnight", () => {
    const parsed = parseDateOnly("2026-08-31");
    expect(parsed).toEqual(new Date(2026, 7, 31));
    // The calendar day survives in any timezone — the bug this guards against
    // is "2026-08-31" rendering (and comparing) as the 30th west of Greenwich.
    expect(parsed.getDate()).toBe(31);
    expect(parsed.getMonth()).toBe(7);
  });

  test("compares correctly against a locally-built date", () => {
    expect(parseDateOnly("2026-08-31") >= new Date(2026, 7, 31)).toBe(true);
  });

  test("leaves values that carry a time to the platform parser", () => {
    expect(parseDateOnly("2026-08-31T12:30:00Z")).toEqual(new Date("2026-08-31T12:30:00Z"));
  });
});

describe("startOfDay", () => {
  test("drops the time of day, keeping the local calendar date", () => {
    expect(startOfDay(new Date(2026, 8, 20, 23, 45, 12))).toEqual(new Date(2026, 8, 20));
  });

  test("is already the answer for a value parsed from a date column", () => {
    const parsed = parseDateOnly("2026-08-31");
    expect(startOfDay(parsed)).toEqual(parsed);
  });

  test("lets 'now' compare equal to the same day from a date column", () => {
    // The whole point: without this, a 14:00 'today' sorts after midnight
    // today and an on-time statement reads as not yet reached.
    expect(startOfDay(new Date(2026, 7, 31, 14, 0))).toEqual(parseDateOnly("2026-08-31"));
  });
});
