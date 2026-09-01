// Minimal shapes the calculation engine needs — deliberately not the
// Supabase row types (see supabase/migrations/20260831000000_initial_schema.sql).
// Callers pass in whatever slice of a joined account/transaction row matches
// these, which keeps the math testable without a database.

export const ASSET_ACCOUNT_TYPES = [
  "checking",
  "savings",
  "cash",
  "brokerage",
  "retirement",
  "other_asset",
] as const;

export const LIABILITY_ACCOUNT_TYPES = [
  "credit_card",
  "personal_loan",
  "auto_loan",
  "student_loan",
  "mortgage",
  "other_liability",
] as const;

// The subset of asset accounts that count as spendable cash for runway
// purposes (docs/PERSONAL_FINANCE_REQUIREMENTS.md §1 Cash Runway Widget:
// "$8,420 available" matches the Cash line, not Cash + Investments).
export const LIQUID_CASH_ACCOUNT_TYPES = ["checking", "savings", "cash"] as const;

export type AccountType =
  | (typeof ASSET_ACCOUNT_TYPES)[number]
  | (typeof LIABILITY_ACCOUNT_TYPES)[number];

export type CalcAccount = {
  type: AccountType;
  /**
   * Liability balances are stored as positive magnitudes owed (a $7,250
   * credit card balance is `balance: 7250`, not -7250) — matches
   * accounts.balance in the schema and account-form.tsx's "Current
   * balance" field.
   */
  balance: number;
  active: boolean;
  /** APR, percent. Debt accounts only (accounts.interest_rate) — used by the forecast engine's amortization. */
  interest_rate?: number | null;
  /** Debt accounts only (accounts.minimum_payment) — used by the forecast engine's amortization. */
  minimum_payment?: number | null;
};

export type IncomeFrequency = "monthly" | "weekly" | "one_time";

export type CalcIncomeSource = {
  amount: number;
  frequency: IncomeFrequency;
  /** ISO date string, "yyyy-mm-dd" (matches income_sources.start_date). */
  start_date: string | null;
  /** ISO date string, "yyyy-mm-dd" (matches income_sources.end_date). */
  end_date: string | null;
  /** ISO date string, "yyyy-mm-dd" (matches income_sources.expected_date). */
  expected_date: string | null;
};

export type CalcTransactionType = "expense" | "income" | "transfer" | "refund" | "adjustment";

export type CalcTransaction = {
  /** ISO date string, "yyyy-mm-dd" (matches transactions.date). */
  date: string;
  /** Negative = money out, positive = money in (see normalizeAmount). */
  amount: number;
  type: CalcTransactionType;
  categoryName: string | null;
};

export type RecurringFrequency = "daily" | "weekly" | "monthly" | "annually";

export type CalcRecurringExpense = {
  /** Always a positive magnitude (matches recurring_expenses.amount). */
  amount: number;
  frequency: RecurringFrequency;
  active: boolean;
};
