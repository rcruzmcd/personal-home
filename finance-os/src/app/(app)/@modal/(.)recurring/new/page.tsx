import { FormSheet } from "@/components/form-sheet";
import { NewRecurringContent } from "../../../recurring/recurring-form-content";

export default async function NewRecurringExpenseSheet({
  searchParams,
}: PageProps<"/recurring/new">) {
  const params = await searchParams;
  return (
    <FormSheet title="Add recurring expense">
      <NewRecurringContent params={params} />
    </FormSheet>
  );
}
