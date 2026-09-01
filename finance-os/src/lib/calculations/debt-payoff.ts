import { addMonths } from "./date-math";

export type PayoffStrategy = "avalanche" | "snowball" | "custom";

export type DebtAccount = {
  id: string;
  name: string;
  /** Positive magnitude owed (matches CalcAccount.balance). */
  balance: number;
  /** APR, percent. */
  interest_rate: number | null;
  minimum_payment: number | null;
};

export type DebtPayoffInput = {
  debts: readonly DebtAccount[];
  strategy: PayoffStrategy;
  /** Amount paid beyond the combined minimums, applied to one debt at a time per the strategy's priority order. */
  extraPayment: number;
  asOfDate: Date;
  /** Payoff priority order (debt ids). Required for strategy "custom"; ignored otherwise. Any debt left out is appended in its original order. */
  customOrder?: readonly string[];
  /** Safety cap on the simulation length, in months (default 600 = 50 years) — guards against a minimum payment that never covers accruing interest. */
  maxMonths?: number;
};

export type DebtPayoffPerDebt = {
  id: string;
  name: string;
  /** Months from asOfDate until this debt reaches zero, or null if it doesn't within maxMonths. */
  payoffMonth: number | null;
  payoffDate: Date | null;
  interestPaid: number;
};

export type DebtPayoffResult = {
  strategy: PayoffStrategy;
  /** Combined minimum payments plus the extra payment. */
  monthlyPayment: number;
  totalInterestPaid: number;
  debtFreeMonth: number | null;
  debtFreeDate: Date | null;
  perDebt: DebtPayoffPerDebt[];
  /** Months saved vs. paying only the minimums, or null if either scenario doesn't finish within maxMonths. */
  monthsSavedVsMinimum: number | null;
};

const DEFAULT_MAX_MONTHS = 600;
const ZERO_BALANCE_EPSILON = 0.01;

/**
 * Simulates payoff month-by-month (docs/PERSONAL_FINANCE_REQUIREMENTS.md §6
 * "Payoff Strategies"): every debt accrues interest and receives its minimum
 * payment each month, then the extra payment cascades down the strategy's
 * priority order — avalanche orders by highest APR first, snowball by
 * lowest balance first, custom uses the caller-supplied order.
 */
export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const { debts, strategy, extraPayment, asOfDate, customOrder, maxMonths = DEFAULT_MAX_MONTHS } = input;

  const order = resolvePriorityOrder(debts, strategy, customOrder);
  const strategyRun = simulatePayoff(debts, order, extraPayment, maxMonths);
  const minimumOnlyRun = extraPayment > 0 ? simulatePayoff(debts, order, 0, maxMonths) : strategyRun;

  const monthlyPayment = debts.reduce((sum, debt) => sum + (debt.minimum_payment ?? 0), 0) + extraPayment;

  const monthsSavedVsMinimum =
    strategyRun.debtFreeMonth !== null && minimumOnlyRun.debtFreeMonth !== null
      ? minimumOnlyRun.debtFreeMonth - strategyRun.debtFreeMonth
      : null;

  return {
    strategy,
    monthlyPayment,
    totalInterestPaid: strategyRun.totalInterestPaid,
    debtFreeMonth: strategyRun.debtFreeMonth,
    debtFreeDate: strategyRun.debtFreeMonth !== null ? addMonths(asOfDate, strategyRun.debtFreeMonth) : null,
    perDebt: strategyRun.perDebt.map((debt) => ({
      ...debt,
      payoffDate: debt.payoffMonth !== null ? addMonths(asOfDate, debt.payoffMonth) : null,
    })),
    monthsSavedVsMinimum,
  };
}

function resolvePriorityOrder(
  debts: readonly DebtAccount[],
  strategy: PayoffStrategy,
  customOrder?: readonly string[],
): string[] {
  if (strategy === "custom") {
    const knownIds = new Set(debts.map((debt) => debt.id));
    const ordered = (customOrder ?? []).filter((id) => knownIds.has(id));
    const remaining = debts.map((debt) => debt.id).filter((id) => !ordered.includes(id));
    return [...ordered, ...remaining];
  }

  const sorted = [...debts].sort((a, b) =>
    strategy === "avalanche" ? (b.interest_rate ?? 0) - (a.interest_rate ?? 0) : a.balance - b.balance,
  );
  return sorted.map((debt) => debt.id);
}

type SimulationResult = {
  totalInterestPaid: number;
  debtFreeMonth: number | null;
  perDebt: { id: string; name: string; payoffMonth: number | null; interestPaid: number }[];
};

function simulatePayoff(
  debts: readonly DebtAccount[],
  priorityOrder: readonly string[],
  extraPayment: number,
  maxMonths: number,
): SimulationResult {
  const balances = new Map(debts.map((debt) => [debt.id, debt.balance]));
  const interestPaid = new Map(debts.map((debt) => [debt.id, 0]));
  const payoffMonth = new Map<string, number | null>(
    debts.map((debt) => [debt.id, debt.balance <= ZERO_BALANCE_EPSILON ? 0 : null]),
  );

  let totalInterestPaid = 0;
  let month = 0;

  while (month < maxMonths && [...balances.values()].some((balance) => balance > ZERO_BALANCE_EPSILON)) {
    month++;

    for (const debt of debts) {
      const balance = balances.get(debt.id)!;
      if (balance <= ZERO_BALANCE_EPSILON) continue;

      const monthlyRate = (debt.interest_rate ?? 0) / 100 / 12;
      const interest = balance * monthlyRate;
      const owed = balance + interest;
      const minimumPayment = Math.min(debt.minimum_payment ?? 0, owed);

      balances.set(debt.id, owed - minimumPayment);
      interestPaid.set(debt.id, interestPaid.get(debt.id)! + interest);
      totalInterestPaid += interest;
    }

    let extraRemaining = extraPayment;
    for (const id of priorityOrder) {
      if (extraRemaining <= 0) break;

      const balance = balances.get(id)!;
      if (balance <= ZERO_BALANCE_EPSILON) continue;

      const payment = Math.min(extraRemaining, balance);
      balances.set(id, balance - payment);
      extraRemaining -= payment;
    }

    for (const [id, balance] of balances) {
      if (balance <= ZERO_BALANCE_EPSILON && payoffMonth.get(id) === null) {
        payoffMonth.set(id, month);
      }
    }
  }

  const allPaidOff = [...balances.values()].every((balance) => balance <= ZERO_BALANCE_EPSILON);

  return {
    totalInterestPaid,
    debtFreeMonth: allPaidOff ? month : null,
    perDebt: debts.map((debt) => ({
      id: debt.id,
      name: debt.name,
      payoffMonth: payoffMonth.get(debt.id) ?? null,
      interestPaid: interestPaid.get(debt.id) ?? 0,
    })),
  };
}
