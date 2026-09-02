import { describe, expect, test } from "vitest";
import { expectedEntryThrough, isEntryUpToDate } from "../statement-entry";

describe("expectedEntryThrough", () => {
  // Local midnight, not `new Date("2026-09-14")` (UTC midnight): the
  // fallback branch builds its date from local parts, so both have to be on
  // the same clock or the comparison is off by a day west of Greenwich.
  test("uses the statement date when set", () => {
    expect(expectedEntryThrough("2026-09-14", new Date(2026, 8, 20))).toEqual(
      new Date(2026, 8, 14),
    );
  });

  test("falls back to the end of the previous month when unset", () => {
    expect(expectedEntryThrough(null, new Date(2026, 8, 20))).toEqual(new Date(2026, 7, 31));
  });
});

describe("isEntryUpToDate", () => {
  test("false when never marked entered", () => {
    expect(isEntryUpToDate(null, "2026-09-14", new Date(2026, 8, 20))).toBe(false);
  });

  test("true when entered through on/after the statement date", () => {
    expect(isEntryUpToDate("2026-09-14", "2026-09-14", new Date(2026, 8, 20))).toBe(true);
  });

  test("false when entered through is before the statement date", () => {
    expect(isEntryUpToDate("2026-08-14", "2026-09-14", new Date(2026, 8, 20))).toBe(false);
  });

  test("no statement date: true once entered through last month's end", () => {
    expect(isEntryUpToDate("2026-08-31", null, new Date(2026, 8, 20))).toBe(true);
  });
});
