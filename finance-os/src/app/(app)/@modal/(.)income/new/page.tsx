import { FormSheet } from "@/components/form-sheet";
import { NewIncomeContent } from "../../../income/income-form-content";

export default function NewIncomeSourceSheet() {
  return (
    <FormSheet title="Add income source">
      <NewIncomeContent />
    </FormSheet>
  );
}
