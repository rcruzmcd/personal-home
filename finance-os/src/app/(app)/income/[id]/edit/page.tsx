import { FormPage } from "@/components/form-page";
import { EditIncomeContent } from "../../income-form-content";

export default async function EditIncomeSourcePage({
  params,
}: PageProps<"/income/[id]/edit">) {
  const { id } = await params;
  return (
    <FormPage title="Edit income source" breadcrumb={[{ label: "Income", href: "/income" }]}>
      <EditIncomeContent id={id} />
    </FormPage>
  );
}
