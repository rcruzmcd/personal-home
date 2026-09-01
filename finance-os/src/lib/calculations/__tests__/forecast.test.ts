import { describe, expect, test } from "vitest";
import { calculateForecast } from "../forecast";
import { AVG_DAYS_PER_MONTH } from "../date-math";
import type { CalcAccount, CalcIncomeSource, CalcTransaction } from "../types";

function account(overrides: Partial<CalcAccount>): CalcAccount {
  return { type: "checking", balance: 0, active: true, ...overrides };
}

function incomeSource(overrides: Partial<CalcIncomeSource>): CalcIncomeSource {
  return {
    amount: 0,
    frequency: "monthly",
    start_date: null,
    end_date: null,
    expected_date: null,
    ...overrides,
  };
}

function expenseTxn(overrides: Partial<CalcTransaction>): CalcTransaction {
  return { date: "2026-08-15", amount: -100, type: "expense", categoryName: null, ...overrides };
}

const ASOF = new Date("2026-09-01T00:00:00.000Z");

describe("calculateForecast", () => {
  test("empty portfolio projects flat zeros with no warnings", () => {
    const result = calculateForecast({
      accounts: [],
      incomeSources: [],
      transactions: [],
      asOfDate: ASOF,
      horizons: [{ label: "1 month", months: 1 }],
    });

    expect(result.current).toEqual({ date: ASOF, cash: 0, debt: 0, netWorth: 0 });
    expect(result.horizons[0].snapshot).toMatchObject({ cash: 0, debt: 0, netWorth: 0 });
    expect(result.warnings).toEqual([]);
  });

  test("rolls monthly income into cash with no expenses or debt", () => {
    const result = calculateForecast({
      accounts: [account({ type: "checking", balance: 1200 })],
      incomeSources: [
        incomeSource({ frequency: "monthly", amount: 1200, start_date: "2026-01-01" }),
      ],
      transactions: [],
      asOfDate: ASOF,
      horizons: [{ label: "2 months", months: 2 }],
    });

    expect(result.horizons[0].snapshot.cash).toBe(1200 + 1200 * 2);
  });

  test("amortizes a debt account's balance by interest and minimum payment each month", () => {
    const result = calculateForecast({
      accounts: [
        account({
          type: "credit_card",
          balance: 1200,
          interest_rate: 24, // 2%/month
          minimum_payment: 300,
        }),
      ],
      incomeSources: [],
      transactions: [],
      asOfDate: ASOF,
      horizons: [{ label: "1 month", months: 1 }],
    });

    // owed = 1200 * 1.02 = 1224; payment 300 -> balance 924.
    expect(result.horizons[0].snapshot.debt).toBeCloseTo(924);
    // Cash (no liquid accounts) goes negative by the payment amount.
    expect(result.horizons[0].snapshot.cash).toBeCloseTo(-300);
    // Net worth drops by exactly the interest accrued (24), since the
    // payment itself just moves money from cash to debt paydown.
    expect(result.current.netWorth).toBe(-1200);
    expect(result.horizons[0].snapshot.netWorth).toBeCloseTo(-1224);
  });

  test("caps a debt payment so a nearly-paid-off account is never overpaid", () => {
    const result = calculateForecast({
      accounts: [
        account({ type: "personal_loan", balance: 50, interest_rate: 0, minimum_payment: 300 }),
      ],
      incomeSources: [],
      transactions: [],
      asOfDate: ASOF,
      horizons: [{ label: "1 month", months: 1 }],
    });

    expect(result.horizons[0].snapshot.debt).toBe(0);
    expect(result.horizons[0].snapshot.cash).toBe(-50);
  });

  test("warns on the first period cash goes negative", () => {
    const result = calculateForecast({
      accounts: [account({ type: "checking", balance: 1000 })],
      incomeSources: [],
      transactions: [expenseTxn({ amount: -2000, date: "2026-08-15" })],
      asOfDate: ASOF,
      lookbackMonths: 1,
      horizons: [{ label: "3 months", months: 3 }],
    });

    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0].message).toContain("October 2026");
  });

  test("interpolates a fractional-month horizon between the bracketing whole months", () => {
    const result = calculateForecast({
      accounts: [account({ type: "checking", balance: 1200 })],
      incomeSources: [
        incomeSource({ frequency: "monthly", amount: 1200, start_date: "2026-01-01" }),
      ],
      transactions: [],
      asOfDate: ASOF,
      horizons: [{ label: "30 days", months: 30 / AVG_DAYS_PER_MONTH }],
    });

    const fraction = 30 / AVG_DAYS_PER_MONTH;
    expect(result.horizons[0].snapshot.cash).toBeCloseTo(1200 + fraction * 1200);
  });

  test("assumptions report first-month income and historical burn", () => {
    const result = calculateForecast({
      accounts: [account({ type: "checking", balance: 1000 })],
      incomeSources: [
        incomeSource({ frequency: "monthly", amount: 825, start_date: "2026-01-01" }),
      ],
      transactions: [expenseTxn({ amount: -2150, categoryName: "Housing", date: "2026-08-15" })],
      asOfDate: ASOF,
      lookbackMonths: 1,
      horizons: [],
    });

    expect(result.assumptions.monthlyIncome).toBe(825);
    expect(result.assumptions.essentialExpenses).toBeCloseTo(2150);
    expect(result.assumptions.totalExpenses).toBeCloseTo(2150);
  });

  test("holds non-liquid assets constant while cash and debt are projected", () => {
    const result = calculateForecast({
      accounts: [
        account({ type: "checking", balance: 500 }),
        account({ type: "brokerage", balance: 40000 }),
      ],
      incomeSources: [],
      transactions: [],
      asOfDate: ASOF,
      horizons: [{ label: "1 month", months: 1 }],
    });

    expect(result.horizons[0].snapshot.netWorth).toBe(40500);
  });
});
