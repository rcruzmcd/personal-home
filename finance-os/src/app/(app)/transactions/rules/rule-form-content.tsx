import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RuleForm } from "./rule-form";
import { createRule, updateRule } from "./actions";

// Shared by the full page and the intercepted sheet.

async function categoryOptions() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, name").order("position");
  return data ?? [];
}

export async function NewRuleContent() {
  return <RuleForm action={createRule} categories={await categoryOptions()} submitLabel="Add rule" />;
}

export async function EditRuleContent({ id }: { id: string }) {
  const supabase = await createClient();
  const [{ data: rule }, categories] = await Promise.all([
    supabase
      .from("categorization_rules")
      .select("match_field, match_operator, match_value, category_id, subcategory, priority, active")
      .eq("id", id)
      .single(),
    categoryOptions(),
  ]);

  if (!rule) notFound();

  return (
    <RuleForm
      action={updateRule.bind(null, id)}
      categories={categories}
      defaultValues={rule}
      submitLabel="Save changes"
    />
  );
}
