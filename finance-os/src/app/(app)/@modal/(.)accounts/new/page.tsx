import { FormSheet } from "@/components/form-sheet";
import { NewAccountContent } from "../../../accounts/account-form-content";

export default function NewAccountSheet() {
  return (
    <FormSheet title="Add account">
      <NewAccountContent />
    </FormSheet>
  );
}
