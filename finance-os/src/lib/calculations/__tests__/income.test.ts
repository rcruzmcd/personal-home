import { describe, expect, test } from "vitest";
import { projectIncomeForPeriod } from "../income";
import type { CalcIncomeSource } from "../types";

function source(overrides: Partial<CalcIncomeSource>): CalcIncomeSource {
  return {
    amount: 0,
    frequency: "monthly",
    start_date: null,
    end_date: null,
    expected_date: null,
    ...overrides,
  };
}

describe("projectIncomeForPeriod", () => {
  test("monthly source contributes its full amount to a period it's active in", () => {
    const result = projectIncomeForPeriod(
      [source({ frequency: "monthly", amount: 6500, start_date: "2026-01-01" })],
      { start: new Date("2026-09-01"), end: new Date("2026-10-01") },
    );
    expect(result).toBe(6500);
  });

  test("monthly source stops contributing after its end_date", () => {
    const result = projectIncomeForPeriod(
      [
        source({
          frequency: "monthly",
          amount: 6500,
          start_date: "2026-01-01",
          end_date: "2026-07-31",
        }),
      ],
      { start: new Date("2026-09-01"), end: new Date("2026-10-01") },
    );
    expect(result).toBe(0);
  });

  test("monthly source not yet started contributes nothing", () => {
    const result = projectIncomeForPeriod(
      [source({ frequency: "monthly", amount: 6500, start_date: "2026-11-01" })],
      { start: new Date("2026-09-01"), end: new Date("2026-10-01") },
    );
    expect(result).toBe(0);
  });

  test("one_time source contributes only in the period containing its expected_date", () => {
    const sources = [
      source({ frequency: "one_time", amount: 42000, expected_date: "2026-09-15" }),
    ];

    const septemberResult = projectIncomeForPeriod(sources, {
      start: new Date("2026-09-01"),
      end: new Date("2026-10-01"),
    });
    const octoberResult = projectIncomeForPeriod(sources, {
      start: new Date("2026-10-01"),
      end: new Date("2026-11-01"),
    });

    expect(septemberResult).toBe(42000);
    expect(octoberResult).toBe(0);
  });

  test("weekly source sums each occurrence within the period, matching the §7 unemployment example", () => {
    // $825/week starting Sept 1, 2026, for 26 weeks (until ~Feb 23, 2027).
    const sources = [
      source({
        frequency: "weekly",
        amount: 825,
        expected_date: "2026-09-01",
        end_date: "2027-02-23",
      }),
    ];

    // September 2026 has 5 occurrences: 1, 8, 15, 22, 29.
    const result = projectIncomeForPeriod(sources, {
      start: new Date("2026-09-01"),
      end: new Date("2026-10-01"),
    });

    expect(result).toBe(5 * 825);
  });

  test("weekly source excludes occurrences after end_date", () => {
    const sources = [
      source({
        frequency: "weekly",
        amount: 825,
        expected_date: "2026-09-01",
        end_date: "2026-09-10",
      }),
    ];

    // Only Sept 1 and Sept 8 fall on/before end_date within this period.
    const result = projectIncomeForPeriod(sources, {
      start: new Date("2026-09-01"),
      end: new Date("2026-10-01"),
    });

    expect(result).toBe(2 * 825);
  });

  test("weekly source with an anchor years in the past still finds occurrences without excessive iteration", () => {
    const periodStart = new Date("2026-09-01");
    // Exactly 313 weeks before periodStart, so periodStart itself is a
    // scheduled occurrence — this only holds if the lookup jumps straight
    // to it instead of walking every week since the anchor.
    const anchor = new Date(periodStart.getTime() - 313 * 7 * 24 * 60 * 60 * 1000);
    const sources = [
      source({ frequency: "weekly", amount: 100, expected_date: anchor.toISOString().slice(0, 10) }),
    ];

    const result = projectIncomeForPeriod(sources, {
      start: periodStart,
      end: new Date("2026-09-08"),
    });

    expect(result).toBe(100);
  });

  test("sums multiple sources", () => {
    const result = projectIncomeForPeriod(
      [
        source({ frequency: "monthly", amount: 6500, start_date: "2026-01-01" }),
        source({ frequency: "one_time", amount: 42000, expected_date: "2026-09-15" }),
      ],
      { start: new Date("2026-09-01"), end: new Date("2026-10-01") },
    );
    expect(result).toBe(48500);
  });

  test("source with no start_date or expected_date contributes nothing", () => {
    const result = projectIncomeForPeriod([source({ frequency: "monthly", amount: 1000 })], {
      start: new Date("2026-09-01"),
      end: new Date("2026-10-01"),
    });
    expect(result).toBe(0);
  });
});
