import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
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

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-bold text-purple">Income</h1>
        <Link href="/income/new">
          <Button>Add income source</Button>
        </Link>
      </div>

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
                <form action={deleteIncomeSource.bind(null, source.id)}>
                  <Button type="submit" variant="tertiary">
                    Delete
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
