import { FormPage } from "@/components/form-page";
import { NewRecurringContent } from "../recurring-form-content";

export default async function NewRecurringExpensePage({
  searchParams,
}: PageProps<"/recurring/new">) {
  const params = await searchParams;
  return (
    <FormPage
      title="Add recurring expense"
      breadcrumb={[{ label: "Recurring Expenses", href: "/recurring" }]}
    >
      <NewRecurringContent params={params} />
    </FormPage>
  );
}
