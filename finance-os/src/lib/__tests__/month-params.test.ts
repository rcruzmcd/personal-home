import { describe, expect, test } from "vitest";
import { currentMonth, monthHref, monthRange, parseMonthParams, shiftMonth } from "../month-params";

const TODAY = new Date(2026, 8, 20); // 20 Sep 2026

describe("parseMonthParams", () => {
  test("defaults to today's month", () => {
    expect(parseMonthParams(undefined, TODAY)).toEqual({ year: 2026, month: 9 });
    expect(parseMonthParams({}, TODAY)).toEqual({ year: 2026, month: 9 });
  });

  test("reads a valid pair", () => {
    expect(parseMonthParams({ y: "2027", m: "2" }, TODAY)).toEqual({
      year: 2027,
      month: 2,
    });
  });

  test("falls back on an out-of-range month", () => {
    expect(parseMonthParams({ y: "2027", m: "13" }, TODAY)).toEqual({
      year: 2026,
      month: 9,
    });
  });

  test("falls back on a month without a year", () => {
    expect(parseMonthParams({ m: "2" }, TODAY)).toEqual({ year: 2026, month: 9 });
  });

  test("falls back on non-numeric input", () => {
    expect(parseMonthParams({ y: "abc", m: "x" }, TODAY)).toEqual({
      year: 2026,
      month: 9,
    });
  });

  test("takes the first value of a repeated param", () => {
    expect(parseMonthParams({ y: ["2027", "2028"], m: ["3"] }, TODAY)).toEqual({
      year: 2027,
      month: 3,
    });
  });
});

describe("shiftMonth", () => {
  test("steps within a year", () => {
    expect(shiftMonth({ year: 2026, month: 9 }, 1)).toEqual({ year: 2026, month: 10 });
    expect(shiftMonth({ year: 2026, month: 9 }, -1)).toEqual({ year: 2026, month: 8 });
  });

  test("rolls forward past December", () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
  });

  test("rolls back past January", () => {
    expect(shiftMonth({ year: 2026, month: 1 }, -1)).toEqual({ year: 2025, month: 12 });
  });
});

describe("monthHref", () => {
  test("keeps the current month query-less on any base path", () => {
    expect(monthHref("/budgets", currentMonth(TODAY), TODAY)).toBe("/budgets");
  });

  test("names any other month", () => {
    expect(monthHref("/budgets", { year: 2026, month: 10 }, TODAY)).toBe("/budgets?y=2026&m=10");
  });
});

describe("monthRange", () => {
  test("spans the whole month, zero-padded", () => {
    expect(monthRange({ year: 2026, month: 9 })).toEqual({
      start: "2026-09-01",
      end: "2026-09-30",
    });
  });

  test("ends on the 31st of a 31-day month", () => {
    expect(monthRange({ year: 2026, month: 1 }).end).toBe("2026-01-31");
  });

  test("handles a leap February", () => {
    expect(monthRange({ year: 2028, month: 2 }).end).toBe("2028-02-29");
  });
});
