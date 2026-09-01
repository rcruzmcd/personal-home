import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RuleForm } from "../rule-form";
import { createRule } from "../actions";

export default async function NewCategorizationRulePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("position");

  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add categorization rule</CardTitle>
        </CardHeader>
        <CardContent>
          <RuleForm action={createRule} categories={categories ?? []} submitLabel="Add rule" />
        </CardContent>
      </Card>
    </main>
  );
}
