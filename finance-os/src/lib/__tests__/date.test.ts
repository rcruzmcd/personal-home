import { describe, expect, test } from "vitest";
import { parseDateOnly } from "../date";

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
