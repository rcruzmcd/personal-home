import { FormSheet } from "@/components/form-sheet";
import { EditTransactionContent } from "../../../../transactions/transaction-form-content";

export default async function EditTransactionSheet({
  params,
}: PageProps<"/transactions/[id]/edit">) {
  const { id } = await params;
  return (
    <FormSheet title="Edit transaction">
      <EditTransactionContent id={id} />
    </FormSheet>
  );
}
