import { FormPage } from "@/components/form-page";
import { EditRuleContent } from "../../rule-form-content";

export default async function EditRulePage({ params }: PageProps<"/transactions/rules/[id]/edit">) {
  const { id } = await params;
  return (
    <FormPage
      title="Edit rule"
      breadcrumb={[
        { label: "Transactions", href: "/transactions" },
        { label: "Categorization Rules", href: "/transactions/rules" },
      ]}
    >
      <EditRuleContent id={id} />
    </FormPage>
  );
}
