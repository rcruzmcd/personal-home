import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { PageHeader } from "@/components/page-header";
import { Stat } from "@/components/ui/stat";
import { formatCurrency } from "@/lib/format";
import { projectIncomeForPeriod, type CalcIncomeSource } from "@/lib/calculations";
import { deleteIncomeSource } from "./actions";

const FREQUENCY_LABEL: Record<string, string> = {
  monthly: "/month",
  weekly: "/week",
  one_time: " one-time",
};

export default async function IncomePage() {
  const supabase = await createClient();
  const { data: incomeSources } = await supabase
    .from("income_sources")
    .select("id, name, amount, frequency, confidence, expected_date, start_date, end_date")
    .order("start_date", { ascending: false, nullsFirst: false })
    .order("expected_date", { ascending: false, nullsFirst: false });

  // Headline figure for the header: what these sources are expected to pay
  // out over the current calendar month, mixed frequencies normalized.
  const now = new Date();
  const monthlyIncome = projectIncomeForPeriod((incomeSources ?? []) as CalcIncomeSource[], {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  });

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        title="Income"
        stats={
          <Stat label="Expected this month" value={formatCurrency(monthlyIncome)} tone="positive" />
        }
        actions={
          <Link href="/income/new">
            <Button>Add income source</Button>
          </Link>
        }
      />

      {!incomeSources?.length ? (
        <p className="text-body text-muted">No income sources yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {incomeSources.map((source) => (
            <Card key={source.id} className="flex items-center justify-between">
              <div>
                <p className="text-h4 font-semibold text-foreground">{source.name}</p>
                <p className="text-small text-muted">
                  {source.confidence}
                  {source.expected_date && ` · expected ${source.expected_date}`}
                  {source.start_date && !source.expected_date && ` · starts ${source.start_date}`}
                  {source.end_date && ` · ends ${source.end_date}`}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-h4 font-semibold text-foreground">
                  {formatCurrency(source.amount)}
                  <span className="text-small font-normal text-muted">
                    {FREQUENCY_LABEL[source.frequency]}
                  </span>
                </p>
                <Link
                  href={`/income/${source.id}/edit`}
                  className="text-body font-medium text-purple underline"
                >
                  Edit
                </Link>
                <DeleteConfirmDialog
                  onConfirm={deleteIncomeSource.bind(null, source.id)}
                  title="Delete this income source?"
                  description={`This permanently deletes "${source.name}". This cannot be undone.`}
                  trigger={
                    <Button type="button" variant="tertiary">
                      Delete
                    </Button>
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
