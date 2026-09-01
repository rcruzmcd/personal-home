"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatMonthYear } from "@/lib/format";
import { calculateDebtPayoff, type DebtAccount, type PayoffStrategy } from "@/lib/calculations";

const STRATEGIES: { value: PayoffStrategy; label: string; description: string }[] = [
  {
    value: "avalanche",
    label: "Avalanche",
    description: "Extra payment goes to the highest-APR debt first — minimizes total interest paid.",
  },
  {
    value: "snowball",
    label: "Snowball",
    description: "Extra payment goes to the lowest-balance debt first — fast early wins.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "You choose which debt gets the extra payment first.",
  },
];

export function DebtPayoffCalculator({ debts }: { debts: readonly DebtAccount[] }) {
  const [strategy, setStrategy] = useState<PayoffStrategy>("avalanche");
  const [extraPayment, setExtraPayment] = useState(0);
  const [customOrder, setCustomOrder] = useState<string[]>(() => debts.map((debt) => debt.id));
  const [asOfDate] = useState(() => new Date());

  const debtById = useMemo(() => new Map(debts.map((debt) => [debt.id, debt])), [debts]);

  const result = useMemo(
    () => calculateDebtPayoff({ debts, strategy, extraPayment, customOrder, asOfDate }),
    [debts, strategy, extraPayment, customOrder, asOfDate],
  );

  const perDebtByPayoff = useMemo(
    () =>
      [...result.perDebt].sort((a, b) => {
        if (a.payoffMonth === b.payoffMonth) return 0;
        if (a.payoffMonth === null) return 1;
        if (b.payoffMonth === null) return -1;
        return a.payoffMonth - b.payoffMonth;
      }),
    [result.perDebt],
  );

  function moveInCustomOrder(id: string, direction: -1 | 1) {
    setCustomOrder((order) => {
      const index = order.indexOf(id);
      const target = index + direction;
      if (target < 0 || target >= order.length) return order;
      const next = [...order];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card variant="featured">
        <CardHeader>
          <CardTitle>Strategy</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {STRATEGIES.map((option) => (
              <label
                key={option.value}
                className="flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer has-[:checked]:border-purple"
              >
                <input
                  type="radio"
                  name="strategy"
                  value={option.value}
                  checked={strategy === option.value}
                  onChange={() => setStrategy(option.value)}
                  className="mt-1"
                />
                <span>
                  <span className="block text-body font-semibold text-foreground">{option.label}</span>
                  <span className="block text-small text-muted">{option.description}</span>
                </span>
              </label>
            ))}
          </div>

          <div>
            <Label htmlFor="extraPayment">Extra monthly payment</Label>
            <Input
              id="extraPayment"
              type="number"
              min={0}
              step="0.01"
              value={extraPayment}
              onChange={(event) => setExtraPayment(Math.max(0, Number(event.target.value) || 0))}
            />
          </div>

          {strategy === "custom" && (
            <div className="flex flex-col gap-2">
              <p className="text-small text-muted">Priority order for the extra payment</p>
              {customOrder.map((id, index) => {
                const debt = debtById.get(id);
                if (!debt) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                  >
                    <p className="text-body text-foreground">
                      {index + 1}. {debt.name}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="px-2 py-1"
                        disabled={index === 0}
                        onClick={() => moveInCustomOrder(id, -1)}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="px-2 py-1"
                        disabled={index === customOrder.length - 1}
                        onClick={() => moveInCustomOrder(id, 1)}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="featured">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-small text-muted">Monthly payment</p>
              <p className="text-h4 font-semibold text-foreground">{formatCurrency(result.monthlyPayment)}</p>
            </div>
            <div>
              <p className="text-small text-muted">Total interest paid</p>
              <p className="text-h4 font-semibold text-foreground">
                {formatCurrency(result.totalInterestPaid)}
              </p>
            </div>
            <div>
              <p className="text-small text-muted">Debt-free date</p>
              <p className="text-h4 font-semibold text-foreground">
                {result.debtFreeDate ? formatMonthYear(result.debtFreeDate) : "Not within 50 years"}
              </p>
            </div>
            <div>
              <p className="text-small text-muted">Months saved vs. minimums</p>
              <p className="text-h4 font-semibold text-green">
                {result.monthsSavedVsMinimum !== null ? result.monthsSavedVsMinimum : "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            {perDebtByPayoff.map((debt) => (
              <div key={debt.id} className="flex items-center justify-between">
                <p className="text-body text-foreground">{debt.name}</p>
                <div className="text-right">
                  <p className="text-body font-medium text-foreground">
                    {debt.payoffDate ? formatMonthYear(debt.payoffDate) : "Not paid off"}
                  </p>
                  <p className="text-small text-muted">{formatCurrency(debt.interestPaid)} interest</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
