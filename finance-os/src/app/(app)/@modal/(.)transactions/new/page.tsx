import { FormSheet } from "@/components/form-sheet";
import { NewTransactionContent } from "../../../transactions/transaction-form-content";

export default function NewTransactionSheet() {
  return (
    <FormSheet title="Add transaction">
      <NewTransactionContent />
    </FormSheet>
  );
}
