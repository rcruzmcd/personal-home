import type { CalcTransaction } from "./types";
import { DEFAULT_ESSENTIAL_CATEGORIES, isEssentialCategory } from "./categories";
import { AVG_DAYS_PER_MONTH, MS_PER_DAY } from "./date-math";

// Spend with no category can't be matched against a budget, so it needs its
// own accumulator key that no category name can collide with.
const UNCATEGORIZED = Symbol("uncategorized");
type BurnKey = string | typeof UNCATEGORIZED;

export type MonthlyBurnInput = {
  transactions: readonly CalcTransaction[];
  asOfDate: Date;
  /** How far back to average burn over. Default 3, per §8 "based on recent average". */
  lookbackMonths?: number;
  essentialCategories?: readonly string[];
  /**
   * Standing monthly limits keyed by lowercased category name (the budgets
   * table, via budgetLimitsByCategoryName). A category with a limit is
   * projected AT that limit instead of at its own recent average; every other
   * category — and uncategorized spend — keeps averaging. A budgeted category
   * with no history still contributes its limit, which is the point: a budget
   * you have not spent against yet is still money you plan to spend.
   *
   * Opt-in, and only the forecast passes it. Cash runway deliberately does
   * not: runway answers "how long does my current behaviour last", which is a
   * descriptive question, while the forecast answers "how long does my plan
   * last". Overriding runway with intentions would make the app's primary
   * metric (docs/PERSONAL_FINANCE_REQUIREMENTS.md §1) optimistic by design.
   */
  budgetLimits?: Readonly<Record<string, number>>;
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
 *
 * Spend is accumulated per category so `budgetLimits` can replace individual
 * categories' averages. With no budgetLimits the per-category sums add back up
 * to the same totals the flat version produced.
 */
export function calculateMonthlyBurn(input: MonthlyBurnInput): MonthlyBurnResult {
  const {
    transactions,
    asOfDate,
    lookbackMonths = 3,
    essentialCategories = DEFAULT_ESSENTIAL_CATEGORIES,
    budgetLimits,
  } = input;

  const windowStart = new Date(
    asOfDate.getTime() - lookbackMonths * AVG_DAYS_PER_MONTH * MS_PER_DAY,
  );

  // Keyed by lowercased category name so it joins to budgetLimits directly and
  // matches isEssentialCategory's own case-insensitive comparison.
  const spendByCategory = new Map<BurnKey, number>();
  // Display names, kept so essential-ness is still tested against the real
  // category name rather than the lowercased key.
  const nameByKey = new Map<BurnKey, string | null>();

  for (const txn of transactions) {
    if (txn.type !== "expense") continue;

    const txnDate = new Date(txn.date);
    if (txnDate < windowStart || txnDate > asOfDate) continue;

    const key: BurnKey = txn.categoryName ? txn.categoryName.toLowerCase() : UNCATEGORIZED;
    spendByCategory.set(key, (spendByCategory.get(key) ?? 0) + Math.abs(txn.amount));
    nameByKey.set(key, txn.categoryName);
  }

  const monthly = new Map<BurnKey, number>();
  for (const [key, spend] of spendByCategory) {
    monthly.set(key, spend / lookbackMonths);
  }

  // Applied over the union of history and limits, so a budgeted category with
  // no spend in the window still projects.
  if (budgetLimits) {
    for (const [name, limit] of Object.entries(budgetLimits)) {
      const key = name.toLowerCase();
      monthly.set(key, limit);
      if (!nameByKey.has(key)) nameByKey.set(key, name);
    }
  }

  let essentialBurn = 0;
  let totalBurn = 0;
  for (const [key, amount] of monthly) {
    totalBurn += amount;
    if (isEssentialCategory(nameByKey.get(key) ?? null, essentialCategories)) {
      essentialBurn += amount;
    }
  }

  return { essentialBurn, totalBurn };
}
