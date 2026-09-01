import { describe, expect, test } from "vitest";
import { calculateCashFlow } from "../cash-flow";

describe("calculateCashFlow", () => {
  test("matches the §8 formula: starting cash + income - expenses - debt payments +/- transfers", () => {
    const result = calculateCashFlow({
      startingCash: 8420,
      expectedIncome: 3300,
      expectedExpenses: 3480,
      debtPayments: 1240,
      transfers: -500,
    });

    expect(result.endingCash).toBe(8420 + 3300 - 3480 - 1240 - 500);
  });

  test("defaults transfers to 0 when omitted", () => {
    const result = calculateCashFlow({
      startingCash: 1000,
      expectedIncome: 0,
      expectedExpenses: 0,
      debtPayments: 0,
    });

    expect(result.transfers).toBe(0);
    expect(result.endingCash).toBe(1000);
  });

  test("ending cash can go negative", () => {
    const result = calculateCashFlow({
      startingCash: 500,
      expectedIncome: 0,
      expectedExpenses: 800,
      debtPayments: 0,
    });

    expect(result.endingCash).toBe(-300);
  });
});
