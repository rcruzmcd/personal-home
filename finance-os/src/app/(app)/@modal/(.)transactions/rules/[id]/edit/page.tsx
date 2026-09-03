import { FormSheet } from "@/components/form-sheet";
import { EditRuleContent } from "../../../../../transactions/rules/rule-form-content";

export default async function EditRuleSheet({
  params,
}: PageProps<"/transactions/rules/[id]/edit">) {
  const { id } = await params;
  return (
    <FormSheet title="Edit rule">
      <EditRuleContent id={id} />
    </FormSheet>
  );
}
