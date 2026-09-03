import { FormPage } from "@/components/form-page";
import { NewRuleContent } from "../rule-form-content";

export default function NewRulePage() {
  return (
    <FormPage
      title="Add rule"
      breadcrumb={[
        { label: "Transactions", href: "/transactions" },
        { label: "Categorization Rules", href: "/transactions/rules" },
      ]}
    >
      <NewRuleContent />
    </FormPage>
  );
}
