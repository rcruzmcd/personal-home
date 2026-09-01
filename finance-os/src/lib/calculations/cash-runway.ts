import { LIQUID_CASH_ACCOUNT_TYPES, type CalcAccount, type CalcTransaction } from "./types";
import { DEFAULT_ESSENTIAL_CATEGORIES } from "./categories";
import { calculateMonthlyBurn } from "./burn";
import { AVG_DAYS_PER_MONTH, MS_PER_DAY } from "./date-math";

const LIQUID_CASH_TYPE_SET: ReadonlySet<string> = new Set(LIQUID_CASH_ACCOUNT_TYPES);

export type CashRunwayInput = {
  accounts: readonly CalcAccount[];
  transactions: readonly CalcTransaction[];
  asOfDate: Date;
  /** How far back to average burn over. Default 3, per §8 "based on recent average". */
  lookbackMonths?: number;
  essentialCategories?: readonly string[];
};

export type CashRunwayResult = {
  availableCash: number;
  /** $/month, averaged over lookbackMonths. */
  essentialBurn: number;
  /** $/month, averaged over lookbackMonths. */
  totalBurn: number;
  /** Infinity if there's no essential burn to divide by. */
  essentialRunwayMonths: number;
  /** Infinity if there's no burn at all to divide by. */
  currentRunwayMonths: number;
  /** null when totalBurn is 0 — cash never runs out. */
  projectedCashFloorDate: Date | null;
};

/**
 * Cash runway — "the core metric for decision-making"
 * (docs/PERSONAL_FINANCE_REQUIREMENTS.md §1).
 */
export function calculateCashRunway(input: CashRunwayInput): CashRunwayResult {
  const {
    accounts,
    transactions,
    asOfDate,
    lookbackMonths = 3,
    essentialCategories = DEFAULT_ESSENTIAL_CATEGORIES,
  } = input;

  const availableCash = accounts
    .filter((account) => account.active && LIQUID_CASH_TYPE_SET.has(account.type))
    .reduce((sum, account) => sum + account.balance, 0);

  const { essentialBurn, totalBurn } = calculateMonthlyBurn({
    transactions,
    asOfDate,
    lookbackMonths,
    essentialCategories,
  });

  const essentialRunwayMonths = essentialBurn > 0 ? availableCash / essentialBurn : Infinity;
  const currentRunwayMonths = totalBurn > 0 ? availableCash / totalBurn : Infinity;

  const projectedCashFloorDate =
    totalBurn > 0
      ? new Date(asOfDate.getTime() + currentRunwayMonths * AVG_DAYS_PER_MONTH * MS_PER_DAY)
      : null;

  return {
    availableCash,
    essentialBurn,
    totalBurn,
    essentialRunwayMonths,
    currentRunwayMonths,
    projectedCashFloorDate,
  };
}
