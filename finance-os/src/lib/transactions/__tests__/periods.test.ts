import { describe, expect, it } from "vitest";
import { buildPeriodTree, periodLabel } from "../periods";

describe("buildPeriodTree", () => {
  it("groups months under their year, newest year first", () => {
    const tree = buildPeriodTree([
      { year: 2025, month: 12, transaction_count: 4 },
      { year: 2026, month: 8, transaction_count: 3 },
      { year: 2026, month: 1, transaction_count: 2 },
    ]);

    expect(tree.map((y) => y.year)).toEqual([2026, 2025]);
    expect(tree[0].count).toBe(5);
    expect(tree[1].count).toBe(4);
  });

  it("keeps months in calendar order for the month tab strip", () => {
    const tree = buildPeriodTree([
      { year: 2026, month: 8, transaction_count: 3 },
      { year: 2026, month: 1, transaction_count: 2 },
      { year: 2026, month: 5, transaction_count: 1 },
    ]);

    expect(tree[0].months.map((m) => m.month)).toEqual([1, 5, 8]);
  });

  it("returns nothing for an account with no transactions", () => {
    expect(buildPeriodTree([])).toEqual([]);
  });
});

describe("periodLabel", () => {
  it("names the widest scope when no year is selected", () => {
    expect(periodLabel(null, null)).toBe("All time");
  });

  it("names a whole year", () => {
    expect(periodLabel(2026, null)).toBe("2026");
  });

  it("names a month within its year", () => {
    expect(periodLabel(2026, 7)).toBe("Jul 2026");
  });
});
