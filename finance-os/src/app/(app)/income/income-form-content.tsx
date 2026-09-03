import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { IncomeSourceForm } from "./income-source-form";
import { createIncomeSource, updateIncomeSource } from "./actions";

// Shared by the full page and the intercepted sheet.

export function NewIncomeContent() {
  return <IncomeSourceForm action={createIncomeSource} submitLabel="Add income source" />;
}

export async function EditIncomeContent({ id }: { id: string }) {
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
    <IncomeSourceForm
      action={updateIncomeSource.bind(null, id)}
      defaultValues={incomeSource}
      submitLabel="Save changes"
    />
  );
}
