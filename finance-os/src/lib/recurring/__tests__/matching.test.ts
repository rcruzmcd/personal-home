import { describe, expect, test } from "vitest";
import { matchRecurringExpense, type RecurringExpenseForMatching } from "../matching";

function expense(overrides: Partial<RecurringExpenseForMatching>): RecurringExpenseForMatching {
  return { id: "rec-1", merchant: "Netflix", amount: 15.99, ...overrides };
}

describe("matchRecurringExpense", () => {
  test("matches on normalized merchant, ignoring case and processor noise", () => {
    const result = matchRecurringExpense(
      { merchant: "NETFLIX.COM", amount: 15.99, type: "expense" },
      [expense({ merchant: "Netflix.com" })],
    );
    expect(result).toBe("rec-1");
  });

  test("still matches after the price changes", () => {
    const result = matchRecurringExpense(
      { merchant: "Netflix.com", amount: 18.99, type: "expense" },
      [expense({ merchant: "Netflix.com", amount: 15.99 })],
    );
    expect(result).toBe("rec-1");
  });

  test("returns null when no active recurring expense shares the merchant", () => {
    const result = matchRecurringExpense(
      { merchant: "Spotify", amount: 9.99, type: "expense" },
      [expense({ merchant: "Netflix" })],
    );
    expect(result).toBeNull();
  });

  test("ignores non-expense transactions", () => {
    const result = matchRecurringExpense(
      { merchant: "Netflix", amount: 15.99, type: "income" },
      [expense({ merchant: "Netflix" })],
    );
    expect(result).toBeNull();
  });

  test("returns null for a transaction without a merchant", () => {
    const result = matchRecurringExpense(
      { merchant: null, amount: 15.99, type: "expense" },
      [expense({ merchant: "Netflix" })],
    );
    expect(result).toBeNull();
  });

  test("breaks a merchant-name tie by closest amount", () => {
    const result = matchRecurringExpense(
      { merchant: "Netflix", amount: 18.99, type: "expense" },
      [
        expense({ id: "rec-a", merchant: "Netflix", amount: 15.99 }),
        expense({ id: "rec-b", merchant: "Netflix", amount: 18.99 }),
      ],
    );
    expect(result).toBe("rec-b");
  });
});
