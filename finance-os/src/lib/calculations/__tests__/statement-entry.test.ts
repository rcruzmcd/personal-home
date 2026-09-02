import { describe, expect, test } from "vitest";
import { expectedEntryThrough, isEntryUpToDate } from "../statement-entry";

describe("expectedEntryThrough", () => {
  // Local midnight, not `new Date("2026-09-14")` (UTC midnight): the
  // fallback branch builds its date from local parts, so both have to be on
  // the same clock or the comparison is off by a day west of Greenwich.
  test("uses this month's close once it has passed", () => {
    expect(expectedEntryThrough(14, new Date(2026, 8, 20))).toEqual(new Date(2026, 8, 14));
  });

  test("uses last month's close when this month's has not arrived", () => {
    // The old fixed-date column got this wrong: it measured the account
    // against a close still in the future.
    expect(expectedEntryThrough(14, new Date(2026, 8, 3))).toEqual(new Date(2026, 7, 14));
  });

  test("clamps a day-31 close to February's last day", () => {
    expect(expectedEntryThrough(31, new Date(2026, 2, 5))).toEqual(new Date(2026, 1, 28));
  });

  test("falls back to the end of the previous month when unset", () => {
    expect(expectedEntryThrough(null, new Date(2026, 8, 20))).toEqual(new Date(2026, 7, 31));
  });
});

describe("isEntryUpToDate", () => {
  test("false when never marked entered", () => {
    expect(isEntryUpToDate(null, 14, new Date(2026, 8, 20))).toBe(false);
  });

  test("true when entered through on/after the derived close", () => {
    expect(isEntryUpToDate("2026-09-14", 14, new Date(2026, 8, 20))).toBe(true);
  });

  test("false when entered through is a cycle behind", () => {
    expect(isEntryUpToDate("2026-08-14", 14, new Date(2026, 8, 20))).toBe(false);
  });

  test("last month's entry satisfies a close that has not come round yet", () => {
    expect(isEntryUpToDate("2026-08-14", 14, new Date(2026, 8, 3))).toBe(true);
  });

  test("no statement day: true once entered through last month's end", () => {
    expect(isEntryUpToDate("2026-08-31", null, new Date(2026, 8, 20))).toBe(true);
  });
});
