import { describe, expect, test } from "vitest";
import { calculateMonthlyRecurringTotal, monthlyEquivalent } from "../recurring";
import type { CalcRecurringExpense } from "../types";

function expense(overrides: Partial<CalcRecurringExpense>): CalcRecurringExpense {
  return { amount: 100, frequency: "monthly", active: true, ...overrides };
}

describe("monthlyEquivalent", () => {
  test("monthly passes through unchanged", () => {
    expect(monthlyEquivalent(expense({ amount: 20, frequency: "monthly" }))).toBe(20);
  });

  test("annually divides by 12", () => {
    expect(monthlyEquivalent(expense({ amount: 1200, frequency: "annually" }))).toBeCloseTo(100);
  });

  test("weekly converts using average days per month", () => {
    expect(monthlyEquivalent(expense({ amount: 50, frequency: "weekly" }))).toBeCloseTo(
      (50 * 30.4368) / 7,
    );
  });

  test("daily converts using average days per month", () => {
    expect(monthlyEquivalent(expense({ amount: 5, frequency: "daily" }))).toBeCloseTo(
      5 * 30.4368,
    );
  });
});

describe("calculateMonthlyRecurringTotal", () => {
  test("sums monthly-equivalent amounts across mixed frequencies", () => {
    const total = calculateMonthlyRecurringTotal([
      expense({ amount: 1500, frequency: "monthly" }), // rent
      expense({ amount: 20, frequency: "monthly" }), // netflix
      expense({ amount: 120, frequency: "annually" }), // 10/mo
    ]);

    expect(total).toBeCloseTo(1530);
  });

  test("excludes inactive recurring expenses", () => {
    const total = calculateMonthlyRecurringTotal([
      expense({ amount: 1500, frequency: "monthly", active: true }),
      expense({ amount: 500, frequency: "monthly", active: false }),
    ]);

    expect(total).toBe(1500);
  });

  test("empty input totals zero", () => {
    expect(calculateMonthlyRecurringTotal([])).toBe(0);
  });
});
