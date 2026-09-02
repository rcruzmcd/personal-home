import { FormPage } from "@/components/form-page";
import { IncomeSourceForm } from "../income-source-form";
import { createIncomeSource } from "../actions";

export default function NewIncomeSourcePage() {
  return (
    <FormPage title="Add income source" breadcrumb={[{ label: "Income", href: "/income" }]}>
      <IncomeSourceForm action={createIncomeSource} submitLabel="Add income source" />
    </FormPage>
  );
}
