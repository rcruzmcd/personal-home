import { createClient } from "@/lib/supabase/server";
import { FormPage } from "@/components/form-page";
import { RuleForm } from "../rule-form";
import { createRule } from "../actions";

export default async function NewCategorizationRulePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("position");

  return (
    <FormPage
      title="Add categorization rule"
      breadcrumb={[
        { label: "Transactions", href: "/transactions" },
        { label: "Categorization Rules", href: "/transactions/rules" },
      ]}
    >
      <RuleForm action={createRule} categories={categories ?? []} submitLabel="Add rule" />
    </FormPage>
  );
}
