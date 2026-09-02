import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
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
    <FormPage
      title="Edit income source"
      breadcrumb={[{ label: "Income", href: "/income" }]}
    >
      <IncomeSourceForm
        action={updateIncomeSource.bind(null, id)}
        defaultValues={incomeSource}
        submitLabel="Save changes"
      />
    </FormPage>
  );
}
