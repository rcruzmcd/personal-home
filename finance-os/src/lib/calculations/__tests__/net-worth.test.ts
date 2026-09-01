import { describe, expect, test } from "vitest";
import { calculateNetWorth } from "../net-worth";
import type { CalcAccount } from "../types";

function account(overrides: Partial<CalcAccount>): CalcAccount {
  return { type: "checking", balance: 0, active: true, ...overrides };
}

describe("calculateNetWorth", () => {
  test("matches the §1 dashboard example", () => {
    const result = calculateNetWorth([
      account({ type: "checking", balance: 8420 }),
      account({ type: "brokerage", balance: 3200 }),
      account({ type: "credit_card", balance: 31500 }),
      account({ type: "personal_loan", balance: 22970 }),
    ]);

    expect(result.totalAssets).toBe(11620);
    expect(result.totalLiabilities).toBe(54470);
    expect(result.netWorth).toBe(-42850);
  });

  test("excludes inactive accounts", () => {
    const result = calculateNetWorth([
      account({ type: "savings", balance: 1000, active: true }),
      account({ type: "savings", balance: 5000, active: false }),
    ]);

    expect(result.totalAssets).toBe(1000);
    expect(result.byType.savings).toBe(1000);
  });

  test("sums multiple accounts of the same type into byType", () => {
    const result = calculateNetWorth([
      account({ type: "credit_card", balance: 1000 }),
      account({ type: "credit_card", balance: 2500 }),
    ]);

    expect(result.byType.credit_card).toBe(3500);
    expect(result.totalLiabilities).toBe(3500);
  });

  test("empty account list is net worth zero", () => {
    const result = calculateNetWorth([]);
    expect(result).toEqual({ totalAssets: 0, totalLiabilities: 0, netWorth: 0, byType: {} });
  });

  test("all-asset portfolio has zero liabilities and positive net worth", () => {
    const result = calculateNetWorth([
      account({ type: "checking", balance: 500 }),
      account({ type: "retirement", balance: 40000 }),
    ]);

    expect(result.totalLiabilities).toBe(0);
    expect(result.netWorth).toBe(40500);
  });
});
