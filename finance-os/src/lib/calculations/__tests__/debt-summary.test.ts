import { describe, expect, test } from "vitest";
import { calculateDebtSummary } from "../debt-summary";
import type { CalcAccount } from "../types";

function account(overrides: Partial<CalcAccount>): CalcAccount {
  return { type: "checking", balance: 0, active: true, ...overrides };
}

describe("calculateDebtSummary", () => {
  test("matches the §6 dashboard example", () => {
    const result = calculateDebtSummary([
      account({ type: "credit_card", balance: 31500 }),
      account({ type: "personal_loan", balance: 12000 }),
      account({ type: "student_loan", balance: 10970 }),
    ]);

    expect(result.totalDebt).toBe(54470);
    expect(result.byCategory.map((c) => Math.round(c.percentOfTotal))).toEqual([58, 22, 20]);
  });

  test("excludes inactive accounts and non-liability accounts", () => {
    const result = calculateDebtSummary([
      account({ type: "credit_card", balance: 1000, active: true }),
      account({ type: "credit_card", balance: 5000, active: false }),
      account({ type: "checking", balance: 2000, active: true }),
    ]);

    expect(result.totalDebt).toBe(1000);
    expect(result.byCategory).toEqual([{ type: "credit_card", totalBalance: 1000, percentOfTotal: 100 }]);
  });

  test("sums minimum payments and estimated monthly interest across debts", () => {
    const result = calculateDebtSummary([
      account({ type: "credit_card", balance: 1000, interest_rate: 24, minimum_payment: 25 }),
      account({ type: "personal_loan", balance: 2000, interest_rate: 6, minimum_payment: 50 }),
    ]);

    expect(result.totalMinimumPayments).toBe(75);
    expect(result.estimatedMonthlyInterest).toBeCloseTo(1000 * 0.24 / 12 + 2000 * 0.06 / 12, 5);
  });

  test("no debts is an empty summary", () => {
    const result = calculateDebtSummary([account({ type: "checking", balance: 500 })]);

    expect(result).toEqual({
      totalDebt: 0,
      totalMinimumPayments: 0,
      estimatedMonthlyInterest: 0,
      byCategory: [],
    });
  });

  test("multiple accounts of the same liability type combine into one category", () => {
    const result = calculateDebtSummary([
      account({ type: "credit_card", balance: 1000 }),
      account({ type: "credit_card", balance: 500 }),
    ]);

    expect(result.byCategory).toEqual([{ type: "credit_card", totalBalance: 1500, percentOfTotal: 100 }]);
  });
});
