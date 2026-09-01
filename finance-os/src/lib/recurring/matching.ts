// Mirrors src/lib/categorization/rules.ts: pure matching logic lives here
// (not in the server action) so it's testable without a database — callers
// fetch the active recurring expenses and pass them in.

import type { CalcTransactionType } from "../calculations/types";
import { normalizeMerchant } from "../calculations/cadence";

export type MatchableTransaction = {
  merchant: string | null;
  amount: number;
  type: CalcTransactionType;
};

export type RecurringExpenseForMatching = {
  id: string;
  merchant: string | null;
  amount: number;
};

/**
 * Links a transaction to an already-tracked recurring expense purely by
 * merchant identity, not amount — a transaction stays linked to its bill
 * even after a price change (findRecurringPriceChanges is what surfaces
 * that drift, not a refusal to link). Callers should only pass *active*
 * recurring expenses. When more than one active expense shares a
 * normalized merchant, the closest amount breaks the tie.
 */
export function matchRecurringExpense(
  transaction: MatchableTransaction,
  activeRecurringExpenses: readonly RecurringExpenseForMatching[],
): string | null {
  if (transaction.type !== "expense" || !transaction.merchant) return null;

  const merchantKey = normalizeMerchant(transaction.merchant);
  const candidates = activeRecurringExpenses.filter(
    (expense) => expense.merchant && normalizeMerchant(expense.merchant) === merchantKey,
  );
  if (candidates.length === 0) return null;

  const txnAmount = Math.abs(transaction.amount);
  return candidates.reduce((closest, candidate) =>
    Math.abs(candidate.amount - txnAmount) < Math.abs(closest.amount - txnAmount) ? candidate : closest,
  ).id;
}
