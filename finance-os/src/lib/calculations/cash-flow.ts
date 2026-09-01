export type CashFlowPeriodInput = {
  startingCash: number;
  expectedIncome: number;
  expectedExpenses: number;
  debtPayments: number;
  /** Net of transfers between the user's own accounts for the period. Defaults to 0 — see forecast.ts. */
  transfers?: number;
};

export type CashFlowPeriodResult = {
  startingCash: number;
  expectedIncome: number;
  expectedExpenses: number;
  debtPayments: number;
  transfers: number;
  endingCash: number;
};

/**
 * The cash flow formula — "the heart of the application"
 * (docs/PERSONAL_FINANCE_REQUIREMENTS.md §8):
 *
 *   Starting Cash + Expected Income - Expected Expenses - Debt Payments +/- Transfers = Ending Cash
 *
 * Deliberately just the arithmetic: callers (e.g. forecast.ts) are
 * responsible for sourcing each line item from accounts/income
 * sources/transactions, which keeps this formula trivially testable on its
 * own and reusable wherever a single period needs to be rolled forward.
 */
export function calculateCashFlow(input: CashFlowPeriodInput): CashFlowPeriodResult {
  const transfers = input.transfers ?? 0;
  const endingCash =
    input.startingCash +
    input.expectedIncome -
    input.expectedExpenses -
    input.debtPayments +
    transfers;

  return {
    startingCash: input.startingCash,
    expectedIncome: input.expectedIncome,
    expectedExpenses: input.expectedExpenses,
    debtPayments: input.debtPayments,
    transfers,
    endingCash,
  };
}
