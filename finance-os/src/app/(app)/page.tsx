import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { formatCurrency, formatMonths, formatShortDate } from "@/lib/format";
import {
  calculateCashRunway,
  calculateNetWorth,
  type CalcAccount,
  type CalcTransaction,
} from "@/lib/calculations";

// calculateCashRunway only looks back 3 months by default — fetch a wider
// window so that default has full data to work with regardless of when in
// the month this runs.
const TRANSACTION_LOOKBACK_DAYS = 120;

function NetWorthRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-body text-muted">{label}</p>
      <p className="text-body font-medium text-foreground">{formatCurrency(value)}</p>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const asOfDate = new Date();
  const cutoff = new Date(asOfDate);
  cutoff.setDate(cutoff.getDate() - TRANSACTION_LOOKBACK_DAYS);
  const cutoffDate = cutoff.toISOString().slice(0, 10);

  const [{ data: accountRows }, { data: transactionRows }] = await Promise.all([
    supabase.from("accounts").select("type, balance, active"),
    supabase
      .from("transactions")
      .select("date, amount, type, categories(name)")
      .eq("type", "expense")
      .gte("date", cutoffDate),
  ]);

  const accounts: CalcAccount[] = accountRows ?? [];
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
        <PageHeader title="Dashboard" />
        <p className="text-body text-muted">
          Add an account to see your net worth and cash runway.
        </p>
        <div>
          <Link href="/accounts/new">
            <Button>Add account</Button>
          </Link>
        </div>
      </main>
    );
  }

  const netWorth = calculateNetWorth(accounts);
  const runway = calculateCashRunway({ accounts, transactions, asOfDate });

  const cash =
    (netWorth.byType.checking ?? 0) + (netWorth.byType.savings ?? 0) + (netWorth.byType.cash ?? 0);
  const investments = (netWorth.byType.brokerage ?? 0) + (netWorth.byType.retirement ?? 0);
  const creditCards = netWorth.byType.credit_card ?? 0;
  const loans =
    (netWorth.byType.personal_loan ?? 0) +
    (netWorth.byType.auto_loan ?? 0) +
    (netWorth.byType.student_loan ?? 0) +
    (netWorth.byType.mortgage ?? 0);
  const otherAssets = netWorth.byType.other_asset ?? 0;
  const otherLiabilities = netWorth.byType.other_liability ?? 0;

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      {/* No header stats here: the dashboard's body *is* the headline
          figures, and repeating net worth or runway above the cards that
          derive them would state each number twice. */}
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="featured">
          <CardHeader>
            <CardTitle>Net Worth</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <NetWorthRow label="Cash" value={cash} />
            <NetWorthRow label="Investments" value={investments} />
            <NetWorthRow label="Credit cards" value={-creditCards} />
            <NetWorthRow label="Loans" value={-loans} />
            {otherAssets !== 0 && <NetWorthRow label="Other assets" value={otherAssets} />}
            {otherLiabilities !== 0 && (
              <NetWorthRow label="Other liabilities" value={-otherLiabilities} />
            )}
            <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
              <p className="text-body font-semibold text-foreground">Net worth</p>
              <p
                className={`text-h3 font-bold ${netWorth.netWorth < 0 ? "text-foreground" : "text-green"}`}
              >
                {formatCurrency(netWorth.netWorth)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card variant="featured">
          <CardHeader>
            <CardTitle>Cash Runway</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-h3 font-bold text-foreground">
              {formatCurrency(runway.availableCash)}{" "}
              <span className="text-small font-normal text-muted">available</span>
            </p>
            <NetWorthRow label="Essential burn" value={-runway.essentialBurn} />
            <NetWorthRow label="Total burn" value={-runway.totalBurn} />
            <div className="flex items-center justify-between">
              <p className="text-body text-muted">Essential runway</p>
              <p className="text-body font-medium text-foreground">
                {formatMonths(runway.essentialRunwayMonths)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-body text-muted">Current runway</p>
              <p className="text-body font-medium text-foreground">
                {formatMonths(runway.currentRunwayMonths)}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
              <p className="text-body font-semibold text-foreground">Projected cash floor</p>
              <p className="text-body font-semibold text-foreground">
                {formatShortDate(runway.projectedCashFloorDate)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
