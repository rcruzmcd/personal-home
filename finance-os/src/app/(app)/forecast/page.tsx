import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatCurrency, formatMonthYear } from "@/lib/format";
import {
  calculateForecast,
  type CalcAccount,
  type CalcIncomeSource,
  type CalcTransaction,
  type ForecastSnapshot,
} from "@/lib/calculations";

// calculateMonthlyBurn only looks back 3 months by default — fetch a wider
// window so that default has full data to work with regardless of when in
// the month this runs (mirrors dashboard page.tsx).
const TRANSACTION_LOOKBACK_DAYS = 120;

function SnapshotCard({ title, snapshot }: { title: string; snapshot: ForecastSnapshot }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">Cash</p>
          <p className="text-body font-medium text-foreground">{formatCurrency(snapshot.cash)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-body text-muted">Debt</p>
          <p className="text-body font-medium text-foreground">{formatCurrency(snapshot.debt)}</p>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 mt-1">
          <p className="text-small font-semibold text-foreground">Net worth</p>
          <p className="text-body font-semibold text-foreground">
            {formatCurrency(snapshot.netWorth)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ForecastPage() {
  const supabase = await createClient();
  const asOfDate = new Date();
  const cutoff = new Date(asOfDate);
  cutoff.setDate(cutoff.getDate() - TRANSACTION_LOOKBACK_DAYS);
  const cutoffDate = cutoff.toISOString().slice(0, 10);

  const [{ data: accountRows }, { data: incomeRows }, { data: transactionRows }] =
    await Promise.all([
      supabase.from("accounts").select("type, balance, active, interest_rate, minimum_payment"),
      supabase
        .from("income_sources")
        .select("amount, frequency, start_date, end_date, expected_date"),
      supabase
        .from("transactions")
        .select("date, amount, type, categories(name)")
        .eq("type", "expense")
        .gte("date", cutoffDate),
    ]);

  const accounts: CalcAccount[] = accountRows ?? [];
  const incomeSources: CalcIncomeSource[] = incomeRows ?? [];
  const transactions: CalcTransaction[] = (transactionRows ?? []).map((txn) => ({
    date: txn.date,
    amount: txn.amount,
    type: txn.type,
    // categories is a to-one embed (many transactions -> one category), so
    // PostgREST returns it as a single object at runtime — the untyped
    // Supabase client (no generated Database types in this project yet)
    // still types every embed as an array, hence the cast.
    categoryName: (txn.categories as unknown as { name: string } | null)?.name ?? null,
  }));

  if (!accounts.length) {
    return (
      <main className="flex-1 flex flex-col gap-6 px-10 py-16">
        <h1 className="text-h1 font-bold text-purple">Forecast</h1>
        <p className="text-body text-muted">
          Add an account to see your projected financial position.
        </p>
        <div>
          <Link href="/accounts/new">
            <Button>Add account</Button>
          </Link>
        </div>
      </main>
    );
  }

  const forecast = calculateForecast({ accounts, incomeSources, transactions, asOfDate });

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <h1 className="text-h1 font-bold text-purple">Forecast</h1>

      {forecast.warnings.map((warning) => (
        <Alert key={warning.message} variant="callout">
          <AlertDescription>⚠️ {warning.message}</AlertDescription>
        </Alert>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SnapshotCard title="Current" snapshot={forecast.current} />
        {forecast.horizons.map((horizon) => (
          <SnapshotCard key={horizon.label} title={horizon.label} snapshot={horizon.snapshot} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assumptions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-body text-muted">Expected income (next month)</p>
            <p className="text-body font-medium text-foreground">
              {formatCurrency(forecast.assumptions.monthlyIncome)}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-body text-muted">Essential expenses</p>
            <p className="text-body font-medium text-foreground">
              {formatCurrency(forecast.assumptions.essentialExpenses)}/mo
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-body text-muted">Total expenses</p>
            <p className="text-body font-medium text-foreground">
              {formatCurrency(forecast.assumptions.totalExpenses)}/mo
            </p>
          </div>
        </CardContent>
      </Card>

      <p className="text-small text-muted">
        Projection based on income sources, historical spending, and debt minimum payments as of{" "}
        {formatMonthYear(asOfDate)}.
      </p>
    </main>
  );
}
