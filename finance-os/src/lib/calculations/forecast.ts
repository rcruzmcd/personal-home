import {
  ASSET_ACCOUNT_TYPES,
  LIABILITY_ACCOUNT_TYPES,
  LIQUID_CASH_ACCOUNT_TYPES,
  type AccountType,
  type CalcAccount,
  type CalcIncomeSource,
  type CalcTransaction,
} from "./types";
import { calculateNetWorth } from "./net-worth";
import { calculateMonthlyBurn } from "./burn";
import { calculateCashFlow } from "./cash-flow";
import { projectIncomeForPeriod } from "./income";
import { DEFAULT_ESSENTIAL_CATEGORIES } from "./categories";
import { addMonths, AVG_DAYS_PER_MONTH } from "./date-math";

const ASSET_TYPE_SET = new Set<AccountType>(ASSET_ACCOUNT_TYPES);
const LIABILITY_TYPE_SET = new Set<AccountType>(LIABILITY_ACCOUNT_TYPES);
const LIQUID_CASH_TYPE_SET = new Set<AccountType>(LIQUID_CASH_ACCOUNT_TYPES);

export type ForecastSnapshot = {
  date: Date;
  cash: number;
  debt: number;
  netWorth: number;
};

export type ForecastHorizon = {
  label: string;
  /** Months from asOfDate — may be fractional (e.g. 30 days ≈ 0.99 months). */
  months: number;
};

export type ForecastWarning = {
  message: string;
  date: Date;
};

export type ForecastResult = {
  current: ForecastSnapshot;
  horizons: readonly { label: string; snapshot: ForecastSnapshot }[];
  warnings: readonly ForecastWarning[];
  assumptions: {
    /** Expected income in the first forecast month — §9 "Assumptions Display". */
    monthlyIncome: number;
    essentialExpenses: number;
    totalExpenses: number;
  };
};

// §9: "Project your financial position 30, 60, 90 days ahead and 6/12/24 months."
export const DEFAULT_FORECAST_HORIZONS: readonly ForecastHorizon[] = [
  { label: "30 days", months: 30 / AVG_DAYS_PER_MONTH },
  { label: "60 days", months: 60 / AVG_DAYS_PER_MONTH },
  { label: "90 days", months: 90 / AVG_DAYS_PER_MONTH },
  { label: "6 months", months: 6 },
  { label: "12 months", months: 12 },
  { label: "24 months", months: 24 },
];

export type CalculateForecastInput = {
  accounts: readonly CalcAccount[];
  incomeSources: readonly CalcIncomeSource[];
  /** Historical transactions, used to average expected expenses (§8 "based on recent average"). */
  transactions: readonly CalcTransaction[];
  asOfDate: Date;
  lookbackMonths?: number;
  essentialCategories?: readonly string[];
  horizons?: readonly ForecastHorizon[];
  /**
   * Per-category monthly limits (see MonthlyBurnInput.budgetLimits). Budgeted
   * categories project at their limit rather than at their recent average;
   * everything else keeps averaging. Omit to forecast purely from history.
   */
  budgetLimits?: Readonly<Record<string, number>>;
};

const monthYearFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

/**
 * Projects financial position forward by rolling the cash flow formula
 * (cash-flow.ts) one calendar month at a time (docs/PERSONAL_FINANCE_REQUIREMENTS.md
 * §9). Expected expenses are held at the historical monthly average for
 * every period (§8 doesn't model expenses changing over time) — or, for
 * categories the user has budgeted, at the budget limit instead, when
 * budgetLimits is supplied; debt is
 * amortized using each liability account's interest_rate/minimum_payment,
 * capped so a nearly-paid-off account is never overpaid; non-liquid assets
 * (investments, etc.) are held constant since nothing in the schema
 * projects their growth. Transfers are omitted from the projected periods —
 * there's no "expected transfer" concept in the data model, only the
 * historical ledger's actual transfer rows.
 */
export function calculateForecast(input: CalculateForecastInput): ForecastResult {
  const {
    accounts,
    incomeSources,
    transactions,
    asOfDate,
    lookbackMonths = 3,
    essentialCategories = DEFAULT_ESSENTIAL_CATEGORIES,
    horizons = DEFAULT_FORECAST_HORIZONS,
    budgetLimits,
  } = input;

  const { essentialBurn, totalBurn } = calculateMonthlyBurn({
    transactions,
    asOfDate,
    lookbackMonths,
    essentialCategories,
    budgetLimits,
  });

  const currentNetWorth = calculateNetWorth(accounts);
  const nonLiquidAssetTotal = accounts
    .filter((a) => a.active && ASSET_TYPE_SET.has(a.type) && !LIQUID_CASH_TYPE_SET.has(a.type))
    .reduce((sum, a) => sum + a.balance, 0);
  const currentCash = accounts
    .filter((a) => a.active && LIQUID_CASH_TYPE_SET.has(a.type))
    .reduce((sum, a) => sum + a.balance, 0);

  const current: ForecastSnapshot = {
    date: asOfDate,
    cash: currentCash,
    debt: currentNetWorth.totalLiabilities,
    netWorth: currentNetWorth.netWorth,
  };

  const monthCount = Math.max(0, Math.ceil(Math.max(0, ...horizons.map((h) => h.months))));
  const snapshots: ForecastSnapshot[] = [current];
  const warnings: ForecastWarning[] = [];

  let runningAccounts = accounts;
  let runningCash = currentCash;
  let shortfallWarned = false;

  for (let month = 1; month <= monthCount; month++) {
    const periodStart = addMonths(asOfDate, month - 1);
    const periodEnd = addMonths(asOfDate, month);

    const expectedIncome = projectIncomeForPeriod(incomeSources, {
      start: periodStart,
      end: periodEnd,
    });

    const { accounts: nextAccounts, totalDebtPayments } = amortizeMonth(runningAccounts);

    const flow = calculateCashFlow({
      startingCash: runningCash,
      expectedIncome,
      expectedExpenses: totalBurn,
      debtPayments: totalDebtPayments,
    });

    runningCash = flow.endingCash;
    runningAccounts = nextAccounts;

    if (!shortfallWarned && runningCash < 0) {
      shortfallWarned = true;
      warnings.push({
        message: `Current spending pattern results in a projected cash shortfall in ${monthYearFormatter.format(periodEnd)}.`,
        date: periodEnd,
      });
    }

    const totalLiabilities = runningAccounts
      .filter((a) => a.active && LIABILITY_TYPE_SET.has(a.type))
      .reduce((sum, a) => sum + a.balance, 0);

    snapshots.push({
      date: periodEnd,
      cash: runningCash,
      debt: totalLiabilities,
      netWorth: nonLiquidAssetTotal + runningCash - totalLiabilities,
    });
  }

  const horizonResults = horizons.map((horizon) => ({
    label: horizon.label,
    snapshot: interpolateSnapshot(snapshots, horizon.months),
  }));

  const firstMonthIncome = projectIncomeForPeriod(incomeSources, {
    start: asOfDate,
    end: addMonths(asOfDate, 1),
  });

  return {
    current,
    horizons: horizonResults,
    warnings,
    assumptions: {
      monthlyIncome: firstMonthIncome,
      essentialExpenses: essentialBurn,
      totalExpenses: totalBurn,
    },
  };
}

type AmortizeMonthResult = { accounts: CalcAccount[]; totalDebtPayments: number };

function amortizeMonth(accounts: readonly CalcAccount[]): AmortizeMonthResult {
  let totalDebtPayments = 0;
  const nextAccounts = accounts.map((account) => {
    const { account: updated, paymentMade } = amortizeAccount(account);
    totalDebtPayments += paymentMade;
    return updated;
  });
  return { accounts: nextAccounts, totalDebtPayments };
}

/** One month of simple-interest amortization for a single account, capped so the payment never exceeds what's owed. */
function amortizeAccount(account: CalcAccount): { account: CalcAccount; paymentMade: number } {
  if (!LIABILITY_TYPE_SET.has(account.type) || !account.active || account.balance <= 0) {
    return { account, paymentMade: 0 };
  }

  const monthlyRate = (account.interest_rate ?? 0) / 100 / 12;
  const owed = account.balance * (1 + monthlyRate);
  const paymentMade = Math.min(account.minimum_payment ?? 0, owed);

  return { account: { ...account, balance: owed - paymentMade }, paymentMade };
}

/** Linearly interpolates between the two whole-month snapshots bracketing a fractional month horizon. snapshots[i] is the state at i months from asOfDate. */
function interpolateSnapshot(snapshots: readonly ForecastSnapshot[], months: number): ForecastSnapshot {
  const clamped = Math.max(0, Math.min(months, snapshots.length - 1));
  const lowerIndex = Math.floor(clamped);
  const upperIndex = Math.ceil(clamped);
  const lower = snapshots[lowerIndex];
  const upper = snapshots[upperIndex];
  const fraction = clamped - lowerIndex;

  if (fraction === 0 || lower === upper) return lower;

  return {
    date: new Date(lower.date.getTime() + fraction * (upper.date.getTime() - lower.date.getTime())),
    cash: lower.cash + fraction * (upper.cash - lower.cash),
    debt: lower.debt + fraction * (upper.debt - lower.debt),
    netWorth: lower.netWorth + fraction * (upper.netWorth - lower.netWorth),
  };
}
