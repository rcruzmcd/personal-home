import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IncomeSourceForm } from "../../income-source-form";
import { updateIncomeSource } from "../../actions";

export default async function EditIncomeSourcePage({
  params,
}: PageProps<"/income/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: incomeSource } = await supabase
    .from("income_sources")
    .select(
      "name, amount, frequency, start_date, end_date, expected_date, confidence, tax_treatment, notes",
    )
    .eq("id", id)
    .single();

  if (!incomeSource) notFound();

  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit income source</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeSourceForm
            action={updateIncomeSource.bind(null, id)}
            defaultValues={incomeSource}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </main>
  );
}
