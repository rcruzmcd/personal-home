import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit categorization rule</CardTitle>
        </CardHeader>
        <CardContent>
          <RuleForm
            action={updateRule.bind(null, id)}
            categories={categories ?? []}
            defaultValues={rule}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </main>
  );
}
