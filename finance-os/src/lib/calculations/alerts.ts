// Powers the "Financial Data Inbox" (docs/PERSONAL_FINANCE_REQUIREMENTS.md
// §11 "Alert UI" and §12 "Data Quality / Reconciliation"). Every detector
// here is a pure function over already-fetched rows so it's testable
// without a database — the inbox page is the only caller that talks to
// Supabase.

import { MS_PER_DAY } from "./date-math";

export type FinancialAlert = { message: string };

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
  occurrences: number;
  lastDate: string;
};

/**
 * Possible recurring expenses (§10 "Later: Auto-detect based on patterns",
 * §11 "Possible recurring expenses"): a merchant/amount pair that's
 * appeared at least `minOccurrences` times and isn't already tracked as a
 * recurring expense.
 */
export function findPossibleRecurringExpenses(
  transactions: readonly ReviewTransaction[],
  minOccurrences: number = 3,
): PossibleRecurringGroup[] {
  const groups = new Map<string, ReviewTransaction[]>();

  for (const txn of transactions) {
    if (txn.type !== "expense" || !txn.merchant || txn.recurring_expense_id) continue;
    const key = `${txn.merchant.toLowerCase()}|${Math.abs(txn.amount).toFixed(2)}`;
    const group = groups.get(key) ?? [];
    group.push(txn);
    groups.set(key, group);
  }

  return Array.from(groups.values())
    .filter((group) => group.length >= minOccurrences)
    .map((group) => {
      const sorted = [...group].sort((a, b) => (a.date < b.date ? 1 : -1));
      return {
        merchant: sorted[0].merchant!,
        amount: Math.abs(sorted[0].amount),
        occurrences: group.length,
        lastDate: sorted[0].date,
      };
    })
    .sort((a, b) => b.occurrences - a.occurrences);
}
