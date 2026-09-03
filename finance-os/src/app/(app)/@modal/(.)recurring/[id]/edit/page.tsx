import { FormSheet } from "@/components/form-sheet";
import { EditRecurringContent } from "../../../../recurring/recurring-form-content";

export default async function EditRecurringExpenseSheet({
  params,
}: PageProps<"/recurring/[id]/edit">) {
  const { id } = await params;
  return (
    <FormSheet title="Edit recurring expense">
      <EditRecurringContent id={id} />
    </FormSheet>
  );
}
