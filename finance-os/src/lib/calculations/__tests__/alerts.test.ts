import { describe, expect, test } from "vitest";
import {
  detectFinancialAlerts,
  findPossibleDuplicates,
  findPossibleRecurringExpenses,
  findRecurringPriceChanges,
  findUncategorizedTransactions,
  type FinancialAlertAccount,
  type FinancialAlertIncomeSource,
  type RecurringExpenseForPriceCheck,
  type ReviewTransaction,
} from "../alerts";

const ASOF = new Date("2026-08-31T00:00:00.000Z");

function account(overrides: Partial<FinancialAlertAccount>): FinancialAlertAccount {
  return { name: "Account", type: "checking", balance: 0, credit_limit: null, active: true, ...overrides };
}

function txn(overrides: Partial<ReviewTransaction>): ReviewTransaction {
  return {
    id: "txn-1",
    account_id: "acct-1",
    date: "2026-08-01",
    description: "Purchase",
    merchant: null,
    amount: -50,
    type: "expense",
    category_id: null,
    recurring_expense_id: null,
    ...overrides,
  };
}

describe("detectFinancialAlerts", () => {
  test("flags cash runway below the warning threshold", () => {
    const alerts = detectFinancialAlerts({
      accounts: [],
      incomeSources: [],
      currentRunwayMonths: 2.4,
      forecastWarnings: [],
      asOfDate: ASOF,
    });

    expect(alerts.some((a) => a.message.includes("Cash runway"))).toBe(true);
  });

  test("does not flag runway at or above the threshold", () => {
    const alerts = detectFinancialAlerts({
      accounts: [],
      incomeSources: [],
      currentRunwayMonths: 5,
      forecastWarnings: [],
      asOfDate: ASOF,
    });

    expect(alerts.some((a) => a.message.includes("Cash runway"))).toBe(false);
  });

  test("flags credit utilization above threshold, ignores accounts under it", () => {
    const alerts = detectFinancialAlerts({
      accounts: [
        account({ name: "Chase Sapphire", type: "credit_card", balance: 7250, credit_limit: 12000 }), // 60%
        account({ name: "Amex Blue", type: "credit_card", balance: 9000, credit_limit: 10000 }), // 90%
      ],
      incomeSources: [],
      currentRunwayMonths: 10,
      forecastWarnings: [],
      asOfDate: ASOF,
    });

    expect(alerts.some((a) => a.message.includes("Amex Blue"))).toBe(true);
    expect(alerts.some((a) => a.message.includes("Chase Sapphire"))).toBe(false);
  });

  test("ignores inactive credit cards and accounts without a limit", () => {
    const alerts = detectFinancialAlerts({
      accounts: [
        account({ type: "credit_card", balance: 9000, credit_limit: 10000, active: false }),
        account({ type: "credit_card", balance: 9000, credit_limit: null }),
      ],
      incomeSources: [],
      currentRunwayMonths: 10,
      forecastWarnings: [],
      asOfDate: ASOF,
    });

    expect(alerts.length).toBe(0);
  });

  test("passes through forecast warnings", () => {
    const alerts = detectFinancialAlerts({
      accounts: [],
      incomeSources: [],
      currentRunwayMonths: 10,
      forecastWarnings: [{ message: "Projected cash shortfall in January 2027." }],
      asOfDate: ASOF,
    });

    expect(alerts.some((a) => a.message === "Projected cash shortfall in January 2027.")).toBe(
      true,
    );
  });

  test("flags an income source ending within the window", () => {
    const sources: FinancialAlertIncomeSource[] = [
      { name: "Unemployment", end_date: "2026-09-10" }, // 10 days out
      { name: "Freelance", end_date: "2027-06-01" }, // far out
    ];

    const alerts = detectFinancialAlerts({
      accounts: [],
      incomeSources: sources,
      currentRunwayMonths: 10,
      forecastWarnings: [],
      asOfDate: ASOF,
    });

    expect(alerts.some((a) => a.message.includes("Unemployment"))).toBe(true);
    expect(alerts.some((a) => a.message.includes("Freelance"))).toBe(false);
  });
});

describe("findUncategorizedTransactions", () => {
  test("returns expense/income rows missing a category", () => {
    const result = findUncategorizedTransactions([
      txn({ id: "1", category_id: null }),
      txn({ id: "2", category_id: "cat-1" }),
      txn({ id: "3", type: "transfer", category_id: null }),
    ]);

    expect(result.map((t) => t.id)).toEqual(["1"]);
  });
});

describe("findPossibleDuplicates", () => {
  test("groups same account/date/amount/merchant pairs", () => {
    const result = findPossibleDuplicates([
      txn({ id: "1", account_id: "a", date: "2026-08-01", amount: -20, merchant: "Netflix" }),
      txn({ id: "2", account_id: "a", date: "2026-08-01", amount: -20, merchant: "Netflix" }),
      txn({ id: "3", account_id: "a", date: "2026-08-02", amount: -20, merchant: "Netflix" }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].transactions.map((t) => t.id).sort()).toEqual(["1", "2"]);
  });

  test("no duplicates yields an empty array", () => {
    const result = findPossibleDuplicates([
      txn({ id: "1", amount: -20 }),
      txn({ id: "2", amount: -30 }),
    ]);

    expect(result).toEqual([]);
  });
});

describe("findPossibleRecurringExpenses", () => {
  test("flags a merchant repeated on a monthly cadence", () => {
    const result = findPossibleRecurringExpenses([
      txn({ id: "1", date: "2026-06-01", merchant: "Netflix", amount: -20 }),
      txn({ id: "2", date: "2026-07-01", merchant: "Netflix", amount: -20 }),
      txn({ id: "3", date: "2026-08-01", merchant: "Netflix", amount: -20 }),
    ]);

    expect(result).toEqual([
      {
        merchant: "Netflix",
        amount: 20,
        frequency: "monthly",
        occurrences: 3,
        lastDate: "2026-08-01",
        transactionIds: ["1", "2", "3"],
      },
    ]);
  });

  test("merges a mid-series price change into one candidate instead of splitting it", () => {
    const result = findPossibleRecurringExpenses([
      txn({ id: "1", date: "2026-06-01", merchant: "Netflix", amount: -15.99 }),
      txn({ id: "2", date: "2026-07-01", merchant: "Netflix", amount: -15.99 }),
      txn({ id: "3", date: "2026-08-01", merchant: "Netflix", amount: -18.99 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      merchant: "Netflix",
      amount: 18.99,
      frequency: "monthly",
      occurrences: 3,
      priceChange: { previousAmount: 15.99, changedOnDate: "2026-08-01" },
    });
  });

  test("does not flag a price change for a merchant with no stable baseline to begin with", () => {
    // A weekly grocery run naturally varies every visit — there's no fixed
    // price to have "changed" from, so the badge would otherwise fire on
    // nearly every occurrence.
    const result = findPossibleRecurringExpenses([
      txn({ id: "1", date: "2026-07-04", merchant: "Whole Foods", amount: -80 }),
      txn({ id: "2", date: "2026-07-11", merchant: "Whole Foods", amount: -110 }),
      txn({ id: "3", date: "2026-07-18", merchant: "Whole Foods", amount: -95 }),
      txn({ id: "4", date: "2026-07-25", merchant: "Whole Foods", amount: -127 }),
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].priceChange).toBeUndefined();
  });

  test("does not flag a merchant seen fewer than minOccurrences times", () => {
    const result = findPossibleRecurringExpenses([
      txn({ id: "1", merchant: "One-off Store", amount: -20 }),
      txn({ id: "2", merchant: "One-off Store", amount: -20 }),
    ]);

    expect(result).toEqual([]);
  });

  test("does not flag a merchant with no inferable cadence", () => {
    const result = findPossibleRecurringExpenses([
      txn({ id: "1", date: "2026-06-01", merchant: "Corner Store", amount: -20 }),
      txn({ id: "2", date: "2026-06-05", merchant: "Corner Store", amount: -20 }),
      txn({ id: "3", date: "2026-08-20", merchant: "Corner Store", amount: -20 }),
    ]);

    expect(result).toEqual([]);
  });

  test("excludes transactions already linked to a recurring expense", () => {
    const result = findPossibleRecurringExpenses([
      txn({ id: "1", merchant: "Netflix", amount: -20, recurring_expense_id: "rec-1" }),
      txn({ id: "2", merchant: "Netflix", amount: -20, recurring_expense_id: "rec-1" }),
      txn({ id: "3", merchant: "Netflix", amount: -20, recurring_expense_id: "rec-1" }),
    ]);

    expect(result).toEqual([]);
  });

  test("excludes non-expense types and rows without a merchant", () => {
    const result = findPossibleRecurringExpenses([
      txn({ id: "1", merchant: "Netflix", amount: 20, type: "income" }),
      txn({ id: "2", merchant: null, amount: -20 }),
    ]);

    expect(result).toEqual([]);
  });
});

describe("findRecurringPriceChanges", () => {
  function recurring(overrides: Partial<RecurringExpenseForPriceCheck>): RecurringExpenseForPriceCheck {
    return { id: "rec-1", name: "Netflix", amount: 15.99, active: true, ...overrides };
  }

  test("flags a tracked expense whose latest linked transaction amount drifted", () => {
    const result = findRecurringPriceChanges(
      [recurring({})],
      [
        txn({ id: "1", date: "2026-07-01", amount: -15.99, recurring_expense_id: "rec-1" }),
        txn({ id: "2", date: "2026-08-01", amount: -18.99, recurring_expense_id: "rec-1" }),
      ],
    );

    expect(result).toEqual([{ name: "Netflix", previousAmount: 15.99, newAmount: 18.99 }]);
  });

  test("ignores a small change within tolerance", () => {
    const result = findRecurringPriceChanges(
      [recurring({})],
      [txn({ id: "1", date: "2026-08-01", amount: -16.1, recurring_expense_id: "rec-1" })],
    );

    expect(result).toEqual([]);
  });

  test("ignores inactive recurring expenses and unlinked transactions", () => {
    const result = findRecurringPriceChanges(
      [recurring({ active: false })],
      [txn({ id: "1", date: "2026-08-01", amount: -18.99, recurring_expense_id: "rec-1" })],
    );

    expect(result).toEqual([]);

    const noLink = findRecurringPriceChanges(
      [recurring({})],
      [txn({ id: "1", date: "2026-08-01", amount: -18.99, recurring_expense_id: null })],
    );

    expect(noLink).toEqual([]);
  });
});
