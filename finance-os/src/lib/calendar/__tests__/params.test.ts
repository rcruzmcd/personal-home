import { describe, expect, test } from "vitest";
import {
  calendarHref,
  currentMonth,
  parseCalendarMonthParams,
  shiftMonth,
} from "../params";

const TODAY = new Date(2026, 8, 20); // 20 Sep 2026

describe("parseCalendarMonthParams", () => {
  test("defaults to today's month", () => {
    expect(parseCalendarMonthParams(undefined, TODAY)).toEqual({ year: 2026, month: 9 });
    expect(parseCalendarMonthParams({}, TODAY)).toEqual({ year: 2026, month: 9 });
  });

  test("reads a valid pair", () => {
    expect(parseCalendarMonthParams({ y: "2027", m: "2" }, TODAY)).toEqual({
      year: 2027,
      month: 2,
    });
  });

  test("falls back on an out-of-range month", () => {
    expect(parseCalendarMonthParams({ y: "2027", m: "13" }, TODAY)).toEqual({
      year: 2026,
      month: 9,
    });
  });

  test("falls back on a month without a year", () => {
    expect(parseCalendarMonthParams({ m: "2" }, TODAY)).toEqual({ year: 2026, month: 9 });
  });

  test("falls back on non-numeric input", () => {
    expect(parseCalendarMonthParams({ y: "abc", m: "x" }, TODAY)).toEqual({
      year: 2026,
      month: 9,
    });
  });

  test("takes the first value of a repeated param", () => {
    expect(parseCalendarMonthParams({ y: ["2027", "2028"], m: ["3"] }, TODAY)).toEqual({
      year: 2027,
      month: 3,
    });
  });
});

describe("calendarHref", () => {
  test("keeps the current month query-less", () => {
    expect(calendarHref(currentMonth(TODAY), TODAY)).toBe("/calendar");
  });

  test("names any other month", () => {
    expect(calendarHref({ year: 2026, month: 10 }, TODAY)).toBe("/calendar?y=2026&m=10");
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
