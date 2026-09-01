import { describe, expect, test } from "vitest";
import { calculateDebtPayoff } from "../debt-payoff";
import type { DebtAccount } from "../debt-payoff";
import { addMonths } from "../date-math";

function debt(overrides: Partial<DebtAccount> & Pick<DebtAccount, "id">): DebtAccount {
  return { name: overrides.id, balance: 0, interest_rate: 0, minimum_payment: 0, ...overrides };
}

const asOfDate = new Date("2026-01-01");

describe("calculateDebtPayoff", () => {
  test("avalanche sends the extra payment to the highest-APR debt first", () => {
    const debts = [
      debt({ id: "cc", balance: 1000, interest_rate: 24, minimum_payment: 25 }),
      debt({ id: "loan", balance: 1000, interest_rate: 6, minimum_payment: 25 }),
    ];

    const result = calculateDebtPayoff({
      debts,
      strategy: "avalanche",
      extraPayment: 200,
      asOfDate,
    });

    const cc = result.perDebt.find((d) => d.id === "cc")!;
    const loan = result.perDebt.find((d) => d.id === "loan")!;
    expect(cc.payoffMonth).not.toBeNull();
    expect(loan.payoffMonth).not.toBeNull();
    expect(cc.payoffMonth!).toBeLessThan(loan.payoffMonth!);
  });

  test("snowball sends the extra payment to the lowest-balance debt first", () => {
    const debts = [
      debt({ id: "big", balance: 5000, interest_rate: 10, minimum_payment: 50 }),
      debt({ id: "small", balance: 500, interest_rate: 10, minimum_payment: 50 }),
    ];

    const result = calculateDebtPayoff({
      debts,
      strategy: "snowball",
      extraPayment: 200,
      asOfDate,
    });

    const big = result.perDebt.find((d) => d.id === "big")!;
    const small = result.perDebt.find((d) => d.id === "small")!;
    expect(small.payoffMonth!).toBeLessThan(big.payoffMonth!);
  });

  test("custom strategy follows the caller-supplied priority order", () => {
    const debts = [
      debt({ id: "a", balance: 1000, interest_rate: 5, minimum_payment: 25 }),
      debt({ id: "b", balance: 1000, interest_rate: 5, minimum_payment: 25 }),
    ];

    const result = calculateDebtPayoff({
      debts,
      strategy: "custom",
      customOrder: ["b", "a"],
      extraPayment: 200,
      asOfDate,
    });

    const a = result.perDebt.find((d) => d.id === "a")!;
    const b = result.perDebt.find((d) => d.id === "b")!;
    expect(b.payoffMonth!).toBeLessThan(a.payoffMonth!);
  });

  test("debt-free date is asOfDate plus the months to pay off the last debt", () => {
    const debts = [debt({ id: "a", balance: 100, interest_rate: 0, minimum_payment: 50 })];

    const result = calculateDebtPayoff({
      debts,
      strategy: "avalanche",
      extraPayment: 0,
      asOfDate,
    });

    expect(result.debtFreeMonth).toBe(2);
    expect(result.debtFreeDate).toEqual(addMonths(asOfDate, 2));
  });

  test("months saved compares the strategy run against minimum-only payments", () => {
    const debts = [
      debt({ id: "a", balance: 1000, interest_rate: 12, minimum_payment: 20 }),
      debt({ id: "b", balance: 1000, interest_rate: 12, minimum_payment: 20 }),
    ];

    const result = calculateDebtPayoff({
      debts,
      strategy: "avalanche",
      extraPayment: 300,
      asOfDate,
    });

    expect(result.monthsSavedVsMinimum).not.toBeNull();
    expect(result.monthsSavedVsMinimum!).toBeGreaterThan(0);
  });

  test("a minimum payment that never covers interest never finishes within maxMonths", () => {
    const debts = [debt({ id: "a", balance: 1000, interest_rate: 30, minimum_payment: 5 })];

    const result = calculateDebtPayoff({
      debts,
      strategy: "avalanche",
      extraPayment: 0,
      asOfDate,
      maxMonths: 24,
    });

    expect(result.debtFreeMonth).toBeNull();
    expect(result.debtFreeDate).toBeNull();
    expect(result.monthsSavedVsMinimum).toBeNull();
    expect(result.perDebt[0].payoffMonth).toBeNull();
  });

  test("monthlyPayment is the sum of minimums plus the extra payment", () => {
    const debts = [
      debt({ id: "a", balance: 1000, interest_rate: 10, minimum_payment: 30 }),
      debt({ id: "b", balance: 1000, interest_rate: 10, minimum_payment: 40 }),
    ];

    const result = calculateDebtPayoff({
      debts,
      strategy: "snowball",
      extraPayment: 100,
      asOfDate,
    });

    expect(result.monthlyPayment).toBe(170);
  });

  test("no debts is already debt-free", () => {
    const result = calculateDebtPayoff({
      debts: [],
      strategy: "avalanche",
      extraPayment: 100,
      asOfDate,
    });

    expect(result.debtFreeMonth).toBe(0);
    expect(result.debtFreeDate).toEqual(asOfDate);
    expect(result.totalInterestPaid).toBe(0);
  });
});
