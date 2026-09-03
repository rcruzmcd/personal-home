import { FormPage } from "@/components/form-page";
import { EditRecurringContent } from "../../recurring-form-content";

export default async function EditRecurringExpensePage({
  params,
}: PageProps<"/recurring/[id]/edit">) {
  const { id } = await params;
  return (
    <FormPage
      title="Edit recurring expense"
      breadcrumb={[{ label: "Recurring Expenses", href: "/recurring" }]}
    >
      <EditRecurringContent id={id} />
    </FormPage>
  );
}
