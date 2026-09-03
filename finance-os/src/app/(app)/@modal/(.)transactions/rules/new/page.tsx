import { FormSheet } from "@/components/form-sheet";
import { NewRuleContent } from "../../../../transactions/rules/rule-form-content";

export default function NewRuleSheet() {
  return (
    <FormSheet title="Add rule">
      <NewRuleContent />
    </FormSheet>
  );
}
