import { describe, expect, test } from "vitest";
import { calculateMonthlyBurn } from "../burn";
import type { CalcTransaction } from "../types";

// Inside the default 3-month lookback for the asOfDate used below.
const AS_OF = new Date("2026-09-15T00:00:00Z");

function txn(overrides: Partial<CalcTransaction> = {}): CalcTransaction {
  return {
    date: "2026-09-01",
    amount: -300,
    type: "expense",
    categoryName: "Food",
    ...overrides,
  };
}

describe("calculateMonthlyBurn", () => {
  test("empty input burns nothing", () => {
    expect(calculateMonthlyBurn({ transactions: [], asOfDate: AS_OF })).toEqual({
      essentialBurn: 0,
      totalBurn: 0,
    });
  });

  test("averages expense magnitude over the lookback window", () => {
    const result = calculateMonthlyBurn({
      transactions: [txn({ amount: -300 }), txn({ amount: -600 })],
      asOfDate: AS_OF,
    });
    expect(result.totalBurn).toBeCloseTo(300); // 900 over 3 months
  });

  test("transfers, income, refunds and adjustments are not burn", () => {
    const result = calculateMonthlyBurn({
      transactions: [
        txn({ type: "transfer", amount: -500 }),
        txn({ type: "income", amount: 5000 }),
        txn({ type: "refund", amount: 120 }),
        txn({ type: "adjustment", amount: -75 }),
      ],
      asOfDate: AS_OF,
    });
    expect(result.totalBurn).toBe(0);
  });

  test("transactions outside the window are excluded", () => {
    const result = calculateMonthlyBurn({
      transactions: [txn({ date: "2025-01-01", amount: -900 })],
      asOfDate: AS_OF,
    });
    expect(result.totalBurn).toBe(0);
  });

  test("essential burn tracks only the essential categories", () => {
    const result = calculateMonthlyBurn({
      transactions: [
        txn({ categoryName: "Housing", amount: -1800 }),
        txn({ categoryName: "Shopping", amount: -300 }),
      ],
      asOfDate: AS_OF,
    });
    expect(result.essentialBurn).toBeCloseTo(600);
    expect(result.totalBurn).toBeCloseTo(700);
  });

  describe("budgetLimits", () => {
    test("a budgeted category projects at its limit instead of its average", () => {
      const result = calculateMonthlyBurn({
        transactions: [txn({ categoryName: "Food", amount: -900 })], // averages 300
        asOfDate: AS_OF,
        budgetLimits: { food: 500 },
      });
      expect(result.totalBurn).toBeCloseTo(500);
    });

    test("unbudgeted categories keep averaging alongside budgeted ones", () => {
      const result = calculateMonthlyBurn({
        transactions: [
          txn({ categoryName: "Food", amount: -900 }), // averages 300, budgeted at 500
          txn({ categoryName: "Shopping", amount: -600 }), // averages 200, unbudgeted
        ],
        asOfDate: AS_OF,
        budgetLimits: { food: 500 },
      });
      expect(result.totalBurn).toBeCloseTo(700);
    });

    test("a budgeted category with no history still projects at its limit", () => {
      const result = calculateMonthlyBurn({
        transactions: [],
        asOfDate: AS_OF,
        budgetLimits: { childcare: 400 },
      });
      expect(result.totalBurn).toBeCloseTo(400);
    });

    test("uncategorized spend is never overridden by a limit", () => {
      const result = calculateMonthlyBurn({
        transactions: [txn({ categoryName: null, amount: -900 })],
        asOfDate: AS_OF,
        budgetLimits: { food: 50 },
      });
      // 300 averaged uncategorized + the 50 Food limit.
      expect(result.totalBurn).toBeCloseTo(350);
    });

    test("limit keys match category names case-insensitively", () => {
      const result = calculateMonthlyBurn({
        transactions: [txn({ categoryName: "Dining Out", amount: -900 })],
        asOfDate: AS_OF,
        budgetLimits: { "dining out": 100 },
      });
      expect(result.totalBurn).toBeCloseTo(100);
    });

    test("essential burn follows the override", () => {
      const result = calculateMonthlyBurn({
        transactions: [txn({ categoryName: "Housing", amount: -6000 })], // averages 2000
        asOfDate: AS_OF,
        budgetLimits: { housing: 1500 },
      });
      expect(result.essentialBurn).toBeCloseTo(1500);
      expect(result.totalBurn).toBeCloseTo(1500);
    });

    test("omitting budgetLimits reproduces the historical average exactly", () => {
      const transactions = [
        txn({ categoryName: "Food", amount: -900 }),
        txn({ categoryName: "Shopping", amount: -600 }),
        txn({ categoryName: null, amount: -300 }),
      ];
      expect(calculateMonthlyBurn({ transactions, asOfDate: AS_OF }).totalBurn).toBeCloseTo(600);
    });
  });
});
