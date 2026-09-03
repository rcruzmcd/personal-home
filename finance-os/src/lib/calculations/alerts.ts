// Powers the "Financial Data Inbox" (docs/PERSONAL_FINANCE_REQUIREMENTS.md
// §11 "Alert UI" and §12 "Data Quality / Reconciliation"). Every detector
// here is a pure function over already-fetched rows so it's testable
// without a database — the inbox page is the only caller that talks to
// Supabase.

import { MS_PER_DAY } from "./date-math";
import { inferFrequency, median, normalizeMerchant } from "./cadence";
import type { RecurringFrequency } from "./types";

// A price move smaller than this reads as noise (rounding, a tax-rate
// tick) rather than a genuine repricing (§11 "Subscription increased from
// $15.99 -> $18.99").
const PRICE_CHANGE_MIN_PCT = 0.03;
const PRICE_CHANGE_MIN_DELTA = 1;

function isPriceChange(previousAmount: number, currentAmount: number): boolean {
  const diff = Math.abs(currentAmount - previousAmount);
  return diff > PRICE_CHANGE_MIN_DELTA && diff > previousAmount * PRICE_CHANGE_MIN_PCT;
}

export type FinancialAlert = {
  message: string;
  /** Where to go to resolve it. Alerts that are purely informational have none. */
  href?: string;
  actionLabel?: string;
};

export type FinancialAlertAccount = {
  name: string;
  type: string;
  balance: number;
  credit_limit: number | null;
  active: boolean;
};

export type FinancialAlertIncomeSource = {
  name: string;
  end_date: string | null;
};

export type DetectFinancialAlertsInput = {
  accounts: readonly FinancialAlertAccount[];
  incomeSources: readonly FinancialAlertIncomeSource[];
  currentRunwayMonths: number;
  forecastWarnings: readonly { message: string }[];
  asOfDate: Date;
  /** §1 dashboard framing implies runway is a concern below 3 months. */
  runwayWarningMonths?: number;
  /** §11 "Credit utilization above 70%". */
  creditUtilizationWarningPct?: number;
  /** §11 "Unemployment ending soon (check timeline)" — flag inside this window. */
  incomeEndingWithinDays?: number;
};

/**
 * Financial warnings (§11 "Financial warnings" + "Payment reminders"):
 * low cash runway, over-limit credit utilization, a projected cash
 * shortfall (sourced from the forecast engine's own warnings so the
 * threshold logic isn't duplicated), and an income source ending soon.
 */
export function detectFinancialAlerts(input: DetectFinancialAlertsInput): FinancialAlert[] {
  const {
    accounts,
    incomeSources,
    currentRunwayMonths,
    forecastWarnings,
    asOfDate,
    runwayWarningMonths = 3,
    creditUtilizationWarningPct = 70,
    incomeEndingWithinDays = 30,
  } = input;

  const alerts: FinancialAlert[] = [];

  if (currentRunwayMonths < runwayWarningMonths) {
    alerts.push({
      message: `Cash runway is below ${runwayWarningMonths} months (${currentRunwayMonths.toFixed(1)} months left).`,
    });
  }

  for (const account of accounts) {
    if (!account.active || account.type !== "credit_card" || !account.credit_limit) continue;
    const utilization = (account.balance / account.credit_limit) * 100;
    if (utilization > creditUtilizationWarningPct) {
      alerts.push({
        message: `${account.name} credit utilization is ${utilization.toFixed(0)}%, above ${creditUtilizationWarningPct}%.`,
      });
    }
  }

  for (const warning of forecastWarnings) {
    alerts.push({ message: warning.message });
  }

  for (const source of incomeSources) {
    if (!source.end_date) continue;
    const daysUntilEnd = (new Date(source.end_date).getTime() - asOfDate.getTime()) / MS_PER_DAY;
    if (daysUntilEnd >= 0 && daysUntilEnd <= incomeEndingWithinDays) {
      alerts.push({
        message: `${source.name} ends in ${Math.ceil(daysUntilEnd)} days — check your timeline.`,
      });
    }
  }

  return alerts;
}

export type ReviewTransaction = {
  id: string;
  account_id: string;
  date: string;
  description: string;
  merchant: string | null;
  amount: number;
  type: "expense" | "income" | "transfer" | "refund" | "adjustment";
  category_id: string | null;
  recurring_expense_id: string | null;
};

/**
 * Uncategorized transactions (§11 "Transactions needing categorization").
 * Transfers are excluded — they're never categorized (§3, §4).
 */
export function findUncategorizedTransactions(
  transactions: readonly ReviewTransaction[],
): ReviewTransaction[] {
  return transactions.filter((txn) => txn.type !== "transfer" && !txn.category_id);
}

export type DuplicateGroup = { transactions: ReviewTransaction[] };

/**
 * Possible duplicate transactions (§11, §12): same account, date, amount,
 * and merchant/description — a common symptom of a re-imported CSV or a
 * double-charge.
 */
export function findPossibleDuplicates(
  transactions: readonly ReviewTransaction[],
): DuplicateGroup[] {
  const groups = new Map<string, ReviewTransaction[]>();

  for (const txn of transactions) {
    const key = [txn.account_id, txn.date, txn.amount, (txn.merchant ?? txn.description).toLowerCase()].join(
      "|",
    );
    const group = groups.get(key) ?? [];
    group.push(txn);
    groups.set(key, group);
  }

  return Array.from(groups.values())
    .filter((group) => group.length > 1)
    .map((transactions) => ({ transactions }));
}

export type PossibleRecurringGroup = {
  merchant: string;
  amount: number;
  frequency: RecurringFrequency;
  occurrences: number;
  lastDate: string;
  transactionIds: string[];
  priceChange?: { previousAmount: number; changedOnDate: string };
};

/**
 * Possible recurring expenses (§10 "Later: Auto-detect based on patterns",
 * §11 "Possible recurring expenses"): a merchant that's appeared at least
 * `minOccurrences` times on an inferable cadence and isn't already tracked
 * as a recurring expense. Grouped by merchant only, not amount — so a
 * mid-series price change still reads as one continuing series instead of
 * two sub-threshold groups that never individually reach `minOccurrences`.
 */
export function findPossibleRecurringExpenses(
  transactions: readonly ReviewTransaction[],
  minOccurrences: number = 3,
): PossibleRecurringGroup[] {
  const groups = new Map<string, ReviewTransaction[]>();

  for (const txn of transactions) {
    if (txn.type !== "expense" || !txn.merchant || txn.recurring_expense_id) continue;
    const key = normalizeMerchant(txn.merchant);
    const group = groups.get(key) ?? [];
    group.push(txn);
    groups.set(key, group);
  }

  const results: PossibleRecurringGroup[] = [];

  for (const group of groups.values()) {
    if (group.length < minOccurrences) continue;

    const sorted = [...group].sort((a, b) => (a.date < b.date ? -1 : 1));
    const frequency = inferFrequency(sorted.map((t) => t.date));
    if (!frequency) continue;

    const latest = sorted[sorted.length - 1];
    const latestAmount = Math.abs(latest.amount);
    const earlierAmounts = sorted.slice(0, -1).map((t) => Math.abs(t.amount));
    const baselineAmount = median(earlierAmounts);
    // Only a genuinely *stable* history breaking on the latest charge reads
    // as a price change — a merchant whose amount was already inconsistent
    // (groceries, gas) has no fixed price to have changed from, so flagging
    // every visit would make the badge meaningless noise.
    const hadStableBaseline = earlierAmounts.every((a) => !isPriceChange(baselineAmount, a));

    results.push({
      merchant: latest.merchant!,
      amount: latestAmount,
      frequency,
      occurrences: group.length,
      lastDate: latest.date,
      transactionIds: group.map((t) => t.id),
      ...(hadStableBaseline && isPriceChange(baselineAmount, latestAmount)
        ? { priceChange: { previousAmount: baselineAmount, changedOnDate: latest.date } }
        : {}),
    });
  }

  return results.sort((a, b) => b.occurrences - a.occurrences);
}

export type RecurringExpenseForPriceCheck = {
  id: string;
  name: string;
  amount: number;
  active: boolean;
};

export type RecurringPriceChange = {
  name: string;
  previousAmount: number;
  newAmount: number;
};

/**
 * Flags an active recurring expense whose most recent linked transaction no
 * longer matches its tracked amount (§11 "Subscription increased from
 * $15.99 -> $18.99"). Transactions stay linked across a price change (see
 * matchRecurringExpense in src/lib/recurring/matching.ts) — this is what
 * actually surfaces the drift.
 */
export function findRecurringPriceChanges(
  recurringExpenses: readonly RecurringExpenseForPriceCheck[],
  linkedTransactions: readonly Pick<ReviewTransaction, "recurring_expense_id" | "date" | "amount">[],
): RecurringPriceChange[] {
  const latestByRecurringId = new Map<string, { date: string; amount: number }>();

  for (const txn of linkedTransactions) {
    if (!txn.recurring_expense_id) continue;
    const current = latestByRecurringId.get(txn.recurring_expense_id);
    if (!current || txn.date > current.date) {
      latestByRecurringId.set(txn.recurring_expense_id, {
        date: txn.date,
        amount: Math.abs(txn.amount),
      });
    }
  }

  const changes: RecurringPriceChange[] = [];
  for (const expense of recurringExpenses) {
    if (!expense.active) continue;
    const latest = latestByRecurringId.get(expense.id);
    if (!latest) continue;
    if (isPriceChange(expense.amount, latest.amount)) {
      changes.push({ name: expense.name, previousAmount: expense.amount, newAmount: latest.amount });
    }
  }

  return changes;
}
