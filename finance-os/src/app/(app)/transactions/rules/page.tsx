import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ToggleActiveButton } from "@/components/toggle-active-button";
import { deleteRule, toggleRuleActive } from "./actions";

export default async function CategorizationRulesPage() {
  const supabase = await createClient();
  const { data: rules } = await supabase
    .from("categorization_rules")
    .select(
      "id, match_field, match_operator, match_value, subcategory, priority, active, categories(name)",
    )
    .order("priority", { ascending: false });

  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeader
        breadcrumb={[{ label: "Transactions", href: "/transactions" }]}
        title="Categorization Rules"
        description="Rules that auto-categorize transactions on import, highest priority first."
        actions={
          <Link href="/transactions/rules/new">
            <Button>Add rule</Button>
          </Link>
        }
      />

      {!rules?.length ? (
        <p className="text-body text-muted">No categorization rules yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {rules.map((rule) => {
            const categoryName = (rule.categories as unknown as { name: string } | null)?.name;
            return (
              <Card key={rule.id} className="flex items-center justify-between">
                <div>
                  <p className="text-h4 font-semibold text-foreground">
                    &ldquo;{rule.match_field}&rdquo; {rule.match_operator} &ldquo;{rule.match_value}&rdquo; →{" "}
                    {categoryName}
                    {rule.subcategory ? ` / ${rule.subcategory}` : ""}
                    {!rule.active && <span className="text-small text-muted"> (inactive)</span>}
                  </p>
                  <p className="text-small text-muted">Priority {rule.priority}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/transactions/rules/${rule.id}/edit`}
                    className="text-body font-medium text-purple underline"
                  >
                    Edit
                  </Link>
                  <ToggleActiveButton
                    active={rule.active}
                    onToggle={toggleRuleActive.bind(null, rule.id, rule.active)}
                  />
                  <DeleteConfirmDialog
                    onConfirm={deleteRule.bind(null, rule.id)}
                    title="Delete this rule?"
                    description="This permanently deletes this categorization rule. This cannot be undone."
                    trigger={
                      <Button type="button" variant="tertiary">
                        Delete
                      </Button>
                    }
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
