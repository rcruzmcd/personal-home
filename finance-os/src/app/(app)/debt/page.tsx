import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { calculateDebtSummary, type CalcAccount } from "@/lib/calculations";
import { DebtBreakdownChart } from "./debt-breakdown-chart";

export default async function DebtPage() {
  const supabase = await createClient();
  const { data: accountRows } = await supabase
    .from("accounts")
    .select("type, balance, active, interest_rate, minimum_payment");

  const accounts: CalcAccount[] = accountRows ?? [];
  const summary = calculateDebtSummary(accounts);

  if (summary.byCategory.length === 0) {
    return (
      <main className="flex-1 flex flex-col gap-6 px-10 py-16">
        <h1 className="text-h1 font-bold text-purple">Debt</h1>
        <p className="text-body text-muted">No debt accounts — you&apos;re debt-free.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-bold text-purple">Debt</h1>
        <Link href="/debt/payoff">
          <Button>Payoff calculator</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="featured">
          <CardHeader>
            <CardTitle>Total debt</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-h1 font-bold text-foreground">{formatCurrency(summary.totalDebt)}</p>

            <div className="flex flex-col gap-2">
              {summary.byCategory.map((category) => (
                <div key={category.type} className="flex items-center justify-between">
                  <p className="text-body text-muted capitalize">{category.type.replace(/_/g, " ")}</p>
                  <p className="text-body font-medium text-foreground">
                    {formatCurrency(category.totalBalance)}{" "}
                    <span className="text-small text-muted">
                      ({category.percentOfTotal.toFixed(0)}%)
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-1">
              <div>
                <p className="text-small text-muted">Minimum payments</p>
                <p className="text-body font-semibold text-foreground">
                  {formatCurrency(summary.totalMinimumPayments)}/mo
                </p>
              </div>
              <div>
                <p className="text-small text-muted">Estimated interest</p>
                <p className="text-body font-semibold text-foreground">
                  {formatCurrency(summary.estimatedMonthlyInterest)}/mo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="featured">
          <CardHeader>
            <CardTitle>Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <DebtBreakdownChart
              data={summary.byCategory.map((category) => ({
                label: category.type.replace(/_/g, " "),
                value: category.totalBalance,
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
