import { FormPage } from "@/components/form-page";
import { NewIncomeContent } from "../income-form-content";

export default function NewIncomeSourcePage() {
  return (
    <FormPage title="Add income source" breadcrumb={[{ label: "Income", href: "/income" }]}>
      <NewIncomeContent />
    </FormPage>
  );
}
