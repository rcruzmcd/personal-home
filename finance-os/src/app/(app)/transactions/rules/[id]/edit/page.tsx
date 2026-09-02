import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
import { RuleForm } from "../../rule-form";
import { updateRule } from "../../actions";

export default async function EditCategorizationRulePage({
  params,
}: PageProps<"/transactions/rules/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: rule }, { data: categories }] = await Promise.all([
    supabase
      .from("categorization_rules")
      .select("match_field, match_operator, match_value, category_id, subcategory, priority, active")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("id, name").order("position"),
  ]);

  if (!rule) notFound();

  return (
    <FormPage
      title="Edit categorization rule"
      breadcrumb={[
        { label: "Transactions", href: "/transactions" },
        { label: "Categorization Rules", href: "/transactions/rules" },
      ]}
    >
      <RuleForm
        action={updateRule.bind(null, id)}
        categories={categories ?? []}
        defaultValues={rule}
        submitLabel="Save changes"
      />
    </FormPage>
  );
}
