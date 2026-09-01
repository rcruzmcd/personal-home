import { LIABILITY_ACCOUNT_TYPES, type AccountType, type CalcAccount } from "./types";

const LIABILITY_TYPE_SET = new Set<AccountType>(LIABILITY_ACCOUNT_TYPES);

export type DebtCategoryBreakdown = {
  type: AccountType;
  totalBalance: number;
  percentOfTotal: number;
};

export type DebtSummary = {
  totalDebt: number;
  totalMinimumPayments: number;
  estimatedMonthlyInterest: number;
  byCategory: readonly DebtCategoryBreakdown[];
};

/**
 * Debt dashboard aggregates (docs/PERSONAL_FINANCE_REQUIREMENTS.md §6
 * "Debt Dashboard"): total debt, category breakdown with $ and %, total
 * minimum payments/mo, and estimated interest/mo (each balance's simple
 * monthly interest at its current APR). Mirrors net-worth.ts's convention
 * of taking the full account list and filtering internally.
 */
export function calculateDebtSummary(accounts: readonly CalcAccount[]): DebtSummary {
  const debts = accounts.filter((account) => account.active && LIABILITY_TYPE_SET.has(account.type));

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayments = debts.reduce((sum, debt) => sum + (debt.minimum_payment ?? 0), 0);
  const estimatedMonthlyInterest = debts.reduce(
    (sum, debt) => sum + (debt.balance * (debt.interest_rate ?? 0)) / 100 / 12,
    0,
  );

  const balanceByType = new Map<AccountType, number>();
  for (const debt of debts) {
    balanceByType.set(debt.type, (balanceByType.get(debt.type) ?? 0) + debt.balance);
  }

  const byCategory = [...balanceByType.entries()]
    .map(([type, totalBalance]) => ({
      type,
      totalBalance,
      percentOfTotal: totalDebt > 0 ? (totalBalance / totalDebt) * 100 : 0,
    }))
    .sort((a, b) => b.totalBalance - a.totalBalance);

  return { totalDebt, totalMinimumPayments, estimatedMonthlyInterest, byCategory };
}
