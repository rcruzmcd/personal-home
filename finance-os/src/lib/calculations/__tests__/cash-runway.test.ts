import { describe, expect, test } from "vitest";
import { calculateCashRunway } from "../cash-runway";
import type { CalcAccount, CalcTransaction } from "../types";

function account(overrides: Partial<CalcAccount>): CalcAccount {
  return { type: "checking", balance: 0, active: true, ...overrides };
}

function expenseTxn(overrides: Partial<CalcTransaction>): CalcTransaction {
  return {
    date: "2026-08-15",
    amount: -100,
    type: "expense",
    categoryName: null,
    ...overrides,
  };
}

const ASOF = new Date("2026-08-31T00:00:00.000Z");

describe("calculateCashRunway", () => {
  test("sums only liquid cash accounts as available cash", () => {
    const result = calculateCashRunway({
      accounts: [
        account({ type: "checking", balance: 5000 }),
        account({ type: "savings", balance: 3420 }),
        account({ type: "brokerage", balance: 100000 }), // not liquid, excluded
      ],
      transactions: [],
      asOfDate: ASOF,
    });

    expect(result.availableCash).toBe(8420);
  });

  test("averages essential vs total burn over the lookback window", () => {
    const transactions: CalcTransaction[] = [
      expenseTxn({ date: "2026-08-01", amount: -2150, categoryName: "Housing" }),
      expenseTxn({ date: "2026-08-05", amount: -1330, categoryName: "Shopping" }),
    ];

    const result = calculateCashRunway({
      accounts: [account({ type: "checking", balance: 8420 })],
      transactions,
      asOfDate: ASOF,
      lookbackMonths: 1,
    });

    expect(result.essentialBurn).toBeCloseTo(2150);
    expect(result.totalBurn).toBeCloseTo(3480);
    expect(result.essentialRunwayMonths).toBeCloseTo(8420 / 2150);
    expect(result.currentRunwayMonths).toBeCloseTo(8420 / 3480);
  });

  test("excludes transfers, income, and refunds from burn", () => {
    const transactions: CalcTransaction[] = [
      expenseTxn({ amount: -500, categoryName: "Food" }),
      { date: "2026-08-10", amount: -1000, type: "transfer", categoryName: null },
      { date: "2026-08-10", amount: 6500, type: "income", categoryName: "Salary" },
      { date: "2026-08-10", amount: 50, type: "refund", categoryName: "Shopping" },
    ];

    const result = calculateCashRunway({
      accounts: [account({ balance: 1000 })],
      transactions,
      asOfDate: ASOF,
      lookbackMonths: 1,
    });

    expect(result.totalBurn).toBeCloseTo(500);
  });

  test("excludes transactions outside the lookback window", () => {
    const transactions: CalcTransaction[] = [
      expenseTxn({ date: "2026-08-25", amount: -100 }), // inside 1-month window
      expenseTxn({ date: "2026-01-01", amount: -9000 }), // long before window
    ];

    const result = calculateCashRunway({
      accounts: [account({ balance: 1000 })],
      transactions,
      asOfDate: ASOF,
      lookbackMonths: 1,
    });

    expect(result.totalBurn).toBeCloseTo(100);
  });

  test("zero burn yields infinite runway and a null cash floor date", () => {
    const result = calculateCashRunway({
      accounts: [account({ balance: 1000 })],
      transactions: [],
      asOfDate: ASOF,
    });

    expect(result.essentialRunwayMonths).toBe(Infinity);
    expect(result.currentRunwayMonths).toBe(Infinity);
    expect(result.projectedCashFloorDate).toBeNull();
  });

  test("essential burn of zero with nonzero total burn is finite total runway but infinite essential runway", () => {
    const transactions: CalcTransaction[] = [expenseTxn({ categoryName: "Entertainment" })];

    const result = calculateCashRunway({
      accounts: [account({ balance: 1000 })],
      transactions,
      asOfDate: ASOF,
      lookbackMonths: 1,
    });

    expect(result.essentialBurn).toBe(0);
    expect(result.essentialRunwayMonths).toBe(Infinity);
    expect(result.currentRunwayMonths).toBeCloseTo(10);
  });

  test("projects a cash floor date consistent with the runway length", () => {
    const transactions: CalcTransaction[] = [expenseTxn({ amount: -1000, categoryName: "Housing" })];

    const result = calculateCashRunway({
      accounts: [account({ balance: 2000 })],
      transactions,
      asOfDate: ASOF,
      lookbackMonths: 1,
    });

    expect(result.currentRunwayMonths).toBeCloseTo(2);
    expect(result.projectedCashFloorDate).not.toBeNull();
    const daysAhead =
      (result.projectedCashFloorDate!.getTime() - ASOF.getTime()) / (1000 * 60 * 60 * 24);
    expect(daysAhead).toBeCloseTo(2 * 30.4368, 1);
  });

  test("accepts a custom essential category list", () => {
    const transactions: CalcTransaction[] = [
      expenseTxn({ amount: -200, categoryName: "Gym" }),
      expenseTxn({ amount: -100, categoryName: "Housing" }),
    ];

    const result = calculateCashRunway({
      accounts: [account({ balance: 1000 })],
      transactions,
      asOfDate: ASOF,
      lookbackMonths: 1,
      essentialCategories: ["Gym"],
    });

    expect(result.essentialBurn).toBeCloseTo(200);
    expect(result.totalBurn).toBeCloseTo(300);
  });

  test("excludes inactive liquid accounts from available cash", () => {
    const result = calculateCashRunway({
      accounts: [account({ type: "checking", balance: 5000, active: false })],
      transactions: [],
      asOfDate: ASOF,
    });

    expect(result.availableCash).toBe(0);
  });
});
