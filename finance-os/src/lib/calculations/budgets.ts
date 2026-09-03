import type { CalcBudget, CategorySpend } from "./types";

// A category is "near" its limit once it has used this much of it. 0.8 rather
// than something tighter because the point of the warning is to leave room to
// change behaviour — at 95% the month is already decided.
export const BUDGET_NEAR_LIMIT_RATIO = 0.8;

export type BudgetStatus = "under" | "near" | "over" | "unbudgeted";

export type BudgetLine = {
  /** null on the synthetic "Uncategorized" line. */
  categoryId: string | null;
  categoryName: string;
  /** null when the category has no budget — the grid still renders the row. */
  limit: number | null;
  spent: number;
  /** limit - spent; negative once over. null when unbudgeted. */
  remaining: number | null;
  /** spent / limit, deliberately NOT clamped so 1.3 can read as "130%". null when unbudgeted. */
  ratio: number | null;
  status: BudgetStatus;
};

export type BudgetSummary = {
  /** Every budgetable category, in the caller's order (categories.position). */
  lines: readonly BudgetLine[];
  /** Only the lines needing attention, over first then near, each by ratio descending. */
  attention: readonly BudgetLine[];
  totalBudgeted: number;
  /** Spend in budgeted categories only, so it reconciles against totalBudgeted. */
  totalSpent: number;
  /** totalBudgeted - totalSpent; negative when the plan as a whole is blown. */
  totalRemaining: number;
  /** Spend that no limit covers, including uncategorized — reported, never folded into totalSpent. */
  unbudgetedSpend: number;
  budgetedCount: number;
  overCount: number;
  nearCount: number;
  /**
   * How much of the selected month has elapsed, 0-1. Lets the UI say whether
   * a category is ahead of pace rather than only whether it has blown up.
   * A month wholly in the past is 1; one wholly in the future is 0.
   */
  monthProgress: number;
};

function classify(spent: number, limit: number, nearLimitRatio: number): BudgetStatus {
  if (spent > limit) return "over";
  // A category sitting exactly on its limit has nothing left, so it reads as
  // near rather than under even when the ratio math says 1.0.
  return spent >= limit * nearLimitRatio ? "near" : "under";
}

/**
 * Fraction of `month` that has elapsed as of `asOfDate`, clamped to 0-1.
 * Uses whole days rather than milliseconds so a mid-month date on a DST
 * boundary doesn't drift the figure.
 */
export function monthProgress(month: Date, asOfDate: Date): number {
  const start = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const asOfDay = new Date(asOfDate.getFullYear(), asOfDate.getMonth(), asOfDate.getDate());

  if (asOfDay < start) return 0;
  const monthEnd = new Date(month.getFullYear(), month.getMonth(), daysInMonth);
  if (asOfDay >= monthEnd) return 1;
  // +1 so the 1st of the month counts as one day elapsed, not zero.
  return (asOfDay.getDate() + 1) / daysInMonth;
}

/**
 * Joins the standing limits to one month's actual spend
 * (budget_spend_by_category, see 20260904000000_create_budgets.sql) and
 * classifies each category.
 *
 * Every budgetable category gets a line, budgeted or not: the grid's job is to
 * let the user set a limit on a category that has none, so omitting unbudgeted
 * categories would hide exactly the rows they came to fill in. Spend those
 * categories carry is reported as `unbudgetedSpend` rather than added to
 * `totalSpent`, so the header's Budgeted/Spent/Remaining stay a coherent triple.
 */
export function buildBudgetSummary(input: {
  budgets: readonly CalcBudget[];
  /** Budgetable (expense-type) categories, already in display order. */
  categories: readonly { id: string; name: string }[];
  spendByCategory: readonly CategorySpend[];
  /** Any date inside the month being viewed. */
  month: Date;
  asOfDate: Date;
  nearLimitRatio?: number;
}): BudgetSummary {
  const {
    budgets,
    categories,
    spendByCategory,
    month,
    asOfDate,
    nearLimitRatio = BUDGET_NEAR_LIMIT_RATIO,
  } = input;

  const limitByCategory = new Map(budgets.map((b) => [b.categoryId, b.amount]));
  const spentByCategory = new Map<string | null, number>();
  for (const row of spendByCategory) {
    spentByCategory.set(row.categoryId, (spentByCategory.get(row.categoryId) ?? 0) + row.spent);
  }

  const lines: BudgetLine[] = [];
  let totalBudgeted = 0;
  let totalSpent = 0;
  let unbudgetedSpend = 0;

  for (const category of categories) {
    const spent = spentByCategory.get(category.id) ?? 0;
    const limit = limitByCategory.get(category.id);

    if (limit === undefined) {
      unbudgetedSpend += spent;
      lines.push({
        categoryId: category.id,
        categoryName: category.name,
        limit: null,
        spent,
        remaining: null,
        ratio: null,
        status: "unbudgeted",
      });
      continue;
    }

    totalBudgeted += limit;
    totalSpent += spent;
    lines.push({
      categoryId: category.id,
      categoryName: category.name,
      limit,
      spent,
      remaining: limit - spent,
      // limit is constrained > 0 in the schema, but guard rather than emit Infinity.
      ratio: limit > 0 ? spent / limit : 0,
      status: classify(spent, limit, nearLimitRatio),
    });
  }

  // Spend whose category was deleted, or that was never categorized at all,
  // still left the account — it belongs in unbudgetedSpend or the page's
  // totals silently understate the month.
  const knownCategories = new Set(categories.map((c) => c.id));
  for (const [categoryId, spent] of spentByCategory) {
    if (categoryId === null || !knownCategories.has(categoryId)) unbudgetedSpend += spent;
  }

  const attention = lines
    .filter((line) => line.status === "over" || line.status === "near")
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "over" ? -1 : 1;
      return (b.ratio ?? 0) - (a.ratio ?? 0);
    });

  return {
    lines,
    attention,
    totalBudgeted,
    totalSpent,
    totalRemaining: totalBudgeted - totalSpent,
    unbudgetedSpend,
    budgetedCount: lines.filter((line) => line.status !== "unbudgeted").length,
    overCount: lines.filter((line) => line.status === "over").length,
    nearCount: lines.filter((line) => line.status === "near").length,
    monthProgress: monthProgress(month, asOfDate),
  };
}

export type BudgetAlert = { line: BudgetLine; kind: "over" | "near" };

/**
 * Over-budget and near-limit categories, most urgent first.
 *
 * Returns the raw lines rather than formatted messages: alerts.ts leaves money
 * formatting to the inbox page (see how priceChanges are rendered there), so
 * src/lib/calculations stays free of @/lib/format.
 */
export function detectBudgetAlerts(summary: BudgetSummary): BudgetAlert[] {
  return summary.attention.map((line) => ({
    line,
    kind: line.status === "over" ? "over" : "near",
  }));
}

/**
 * Standing limits keyed by lowercased category name, the shape
 * calculateMonthlyBurn's `budgetLimits` option takes. Keyed by name rather
 * than id because burn works from CalcTransaction, which carries categoryName
 * (the calc layer deliberately holds no ids — see types.ts).
 */
export function budgetLimitsByCategoryName(
  // Only the name and the amount, so a caller that never needed the id (the
  // forecast page) isn't forced to invent one.
  budgets: readonly Pick<CalcBudget, "categoryName" | "amount">[],
): Record<string, number> {
  const limits: Record<string, number> = {};
  for (const budget of budgets) {
    if (!budget.categoryName) continue;
    limits[budget.categoryName.toLowerCase()] = budget.amount;
  }
  return limits;
}
