import type { CalcRecurringExpense, RecurringFrequency } from "./types";
import { AVG_DAYS_PER_MONTH } from "./date-math";

// Converts each frequency to its monthly-equivalent multiplier so recurring
// obligations of different cadences can be summed into one "monthly
// recurring obligations" figure (docs/PERSONAL_FINANCE_REQUIREMENTS.md §10
// dashboard example: "Total: $3,214").
const MONTHLY_MULTIPLIER: Record<RecurringFrequency, number> = {
  daily: AVG_DAYS_PER_MONTH,
  weekly: AVG_DAYS_PER_MONTH / 7,
  monthly: 1,
  annually: 1 / 12,
};

export function monthlyEquivalent(expense: Pick<CalcRecurringExpense, "amount" | "frequency">): number {
  return expense.amount * MONTHLY_MULTIPLIER[expense.frequency];
}

/** Sum of active recurring expenses, normalized to a monthly figure — "a critical number for forecasting" (§10). */
export function calculateMonthlyRecurringTotal(
  expenses: readonly CalcRecurringExpense[],
): number {
  return expenses
    .filter((expense) => expense.active)
    .reduce((sum, expense) => sum + monthlyEquivalent(expense), 0);
}
