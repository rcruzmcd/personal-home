import type { CalcTransaction } from "./types";
import { DEFAULT_ESSENTIAL_CATEGORIES, isEssentialCategory } from "./categories";
import { AVG_DAYS_PER_MONTH, MS_PER_DAY } from "./date-math";

export type MonthlyBurnInput = {
  transactions: readonly CalcTransaction[];
  asOfDate: Date;
  /** How far back to average burn over. Default 3, per §8 "based on recent average". */
  lookbackMonths?: number;
  essentialCategories?: readonly string[];
};

export type MonthlyBurnResult = {
  /** $/month, averaged over lookbackMonths. */
  essentialBurn: number;
  /** $/month, averaged over lookbackMonths. */
  totalBurn: number;
};

/**
 * Average monthly spend over a lookback window — shared by cash runway
 * (docs/PERSONAL_FINANCE_REQUIREMENTS.md §1) and the cash flow / forecast
 * engine's "Expected Expenses" line (§8, §9 "based on recent average").
 *
 * Burn is computed only from type: "expense" transactions: transfers
 * between the user's own accounts must never count as spending (§3
 * "Critical"), and income/refund/adjustment rows aren't burn either.
 */
export function calculateMonthlyBurn(input: MonthlyBurnInput): MonthlyBurnResult {
  const {
    transactions,
    asOfDate,
    lookbackMonths = 3,
    essentialCategories = DEFAULT_ESSENTIAL_CATEGORIES,
  } = input;

  const windowStart = new Date(
    asOfDate.getTime() - lookbackMonths * AVG_DAYS_PER_MONTH * MS_PER_DAY,
  );

  let essentialSpend = 0;
  let totalSpend = 0;

  for (const txn of transactions) {
    if (txn.type !== "expense") continue;

    const txnDate = new Date(txn.date);
    if (txnDate < windowStart || txnDate > asOfDate) continue;

    const magnitude = Math.abs(txn.amount);
    totalSpend += magnitude;
    if (isEssentialCategory(txn.categoryName, essentialCategories)) {
      essentialSpend += magnitude;
    }
  }

  return {
    essentialBurn: essentialSpend / lookbackMonths,
    totalBurn: totalSpend / lookbackMonths,
  };
}
