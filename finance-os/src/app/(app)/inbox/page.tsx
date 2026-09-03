import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { formatCurrency, formatShortDate } from "@/lib/format";
import {
  calculateCashRunway,
  calculateForecast,
  detectFinancialAlerts,
  findPossibleDuplicates,
  findPossibleRecurringExpenses,
  findRecurringPriceChanges,
  findPendingStatements,
  findUncategorizedTransactions,
  type CalcAccount,
  type CalcIncomeSource,
  type CalcTransaction,
  type FinancialAlert,
  type ReviewTransaction,
  type StatementAccount,
} from "@/lib/calculations";

// Wide enough to catch three occurrences of a monthly bill for the
// "possible recurring expense" detector, and matches the dashboard's burn
// lookback window.
const TRANSACTION_LOOKBACK_DAYS = 120;

export default async function InboxPage() {
  const supabase = await createClient();
  const asOfDate = new Date();
  const cutoff = new Date(asOfDate);
  cutoff.setDate(cutoff.getDate() - TRANSACTION_LOOKBACK_DAYS);
  const cutoffDate = cutoff.toISOString().slice(0, 10);

  const [
    { data: accountRows },
    { data: incomeRows },
    { data: transactionRows },
    { data: recurringExpenseRows },
    { data: statementRows },
  ] = await Promise.all([
      supabase
        .from("accounts")
        .select(
          "id, name, type, balance, credit_limit, active, interest_rate, minimum_payment, statement_day, due_day",
        ),
      supabase
        .from("income_sources")
        .select("name, amount, frequency, start_date, end_date, expected_date"),
      supabase
        .from("transactions")
        .select(
          "id, account_id, date, description, merchant, amount, type, category_id, recurring_expense_id, categories(name)",
        )
        .gte("date", cutoffDate),
      supabase.from("recurring_expenses").select("id, name, amount, active").eq("active", true),
      supabase.from("statements").select("account_id, closing_date"),
    ]);

  const accounts: CalcAccount[] = accountRows ?? [];
  const incomeSources: CalcIncomeSource[] = incomeRows ?? [];
  const transactionRowsSafe = transactionRows ?? [];

  const calcTransactions: CalcTransaction[] = transactionRowsSafe.map((txn) => ({
    date: txn.date,
    amount: txn.amount,
    type: txn.type,
    categoryName: (txn.categories as unknown as { name: string } | null)?.name ?? null,
  }));

  const reviewTransactions: ReviewTransaction[] = transactionRowsSafe.map((txn) => ({
    id: txn.id,
    account_id: txn.account_id,
    date: txn.date,
    description: txn.description,
    merchant: txn.merchant,
    amount: txn.amount,
    type: txn.type,
    category_id: txn.category_id,
    recurring_expense_id: txn.recurring_expense_id,
  }));

  const runway = calculateCashRunway({ accounts, transactions: calcTransactions, asOfDate });
  const forecast = calculateForecast({
    accounts,
    incomeSources,
    transactions: calcTransactions,
    asOfDate,
  });

  const alerts = detectFinancialAlerts({
    accounts: accountRows ?? [],
    incomeSources: incomeRows ?? [],
    currentRunwayMonths: runway.currentRunwayMonths,
    forecastWarnings: forecast.warnings,
    asOfDate,
  });
  const priceChanges = findRecurringPriceChanges(recurringExpenseRows ?? [], reviewTransactions);
  // A closed statement nobody has entered is the most actionable thing in the
  // inbox, so it leads (§6 per-debt tracking).
  const pendingStatements = findPendingStatements({
    accounts: (accountRows ?? []) as StatementAccount[],
    recorded: statementRows ?? [],
    asOfDate,
  });
  const allAlerts: FinancialAlert[] = [
    ...pendingStatements.map((statement) => ({
      message: `${statement.accountName} statement closed ${formatShortDate(statement.closingDate)}${
        statement.dueDate ? `, due ${formatShortDate(statement.dueDate)}` : ""
      }.`,
      href: `/accounts/${statement.accountId}/statement`,
      actionLabel: "Record statement",
    })),
    ...alerts,
    ...priceChanges.map((change) => ({
      message: `${change.name} increased from ${formatCurrency(change.previousAmount)} to ${formatCurrency(change.newAmount)}.`,
    })),
  ];
  const uncategorized = findUncategorizedTransactions(reviewTransactions);
  const duplicates = findPossibleDuplicates(reviewTransactions);
  const possibleRecurring = findPossibleRecurringExpenses(reviewTransactions);

  const totalItems =
    allAlerts.length + uncategorized.length + duplicates.length + possibleRecurring.length;

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        title="Inbox"
        description={
          totalItems === 0
            ? "Nothing needs review."
            : `${totalItems} item${totalItems === 1 ? "" : "s"} need review`
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Alerts ({allAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {!allAlerts.length ? (
            <p className="text-body text-muted">No active alerts.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {allAlerts.map((alert, i) => (
                <li key={i} className="flex flex-wrap items-center gap-x-3 text-body text-foreground">
                  <span>⚠️ {alert.message}</span>
                  {alert.href && (
                    <Link href={alert.href} className="font-medium text-purple underline">
                      {alert.actionLabel ?? "Review"}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions needing categorization ({uncategorized.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {!uncategorized.length ? (
            <p className="text-body text-muted">Everything&rsquo;s categorized.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {uncategorized.map((txn) => (
                <li key={txn.id} className="flex items-center justify-between">
                  <span className="text-body text-foreground">
                    {txn.date} · {txn.description}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-body text-foreground">{formatCurrency(txn.amount)}</span>
                    <Link
                      href={`/transactions/${txn.id}/edit`}
                      className="text-body font-medium text-purple underline"
                    >
                      Categorize
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Possible duplicate transactions ({duplicates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {!duplicates.length ? (
            <p className="text-body text-muted">No likely duplicates found.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {duplicates.map((group, i) => (
                <li key={i} className="flex flex-col gap-1">
                  {group.transactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between">
                      <span className="text-body text-foreground">
                        {txn.date} · {txn.description}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-body text-foreground">
                          {formatCurrency(txn.amount)}
                        </span>
                        <Link
                          href={`/transactions/${txn.id}/edit`}
                          className="text-body font-medium text-purple underline"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Possible recurring expenses ({possibleRecurring.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {!possibleRecurring.length ? (
            <p className="text-body text-muted">No new recurring patterns found.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {possibleRecurring.map((group) => (
                <li
                  key={`${group.merchant}-${group.amount}`}
                  className="flex items-center justify-between"
                >
                  <span className="text-body text-foreground">
                    {group.merchant} · {group.frequency} · seen {group.occurrences} times, last{" "}
                    {group.lastDate}
                    {group.priceChange &&
                      ` · price changed from ${formatCurrency(group.priceChange.previousAmount)}`}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-body text-foreground">
                      {formatCurrency(group.amount)}
                    </span>
                    <Link
                      href={`/recurring/new?name=${encodeURIComponent(group.merchant)}&merchant=${encodeURIComponent(group.merchant)}&amount=${group.amount}&frequency=${group.frequency}&transactionIds=${group.transactionIds.join(",")}`}
                      className="text-body font-medium text-purple underline"
                    >
                      Track as recurring
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
