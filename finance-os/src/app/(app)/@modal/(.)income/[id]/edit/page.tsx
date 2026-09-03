import { FormSheet } from "@/components/form-sheet";
import { EditIncomeContent } from "../../../../income/income-form-content";

export default async function EditIncomeSourceSheet({
  params,
}: PageProps<"/income/[id]/edit">) {
  const { id } = await params;
  return (
    <FormSheet title="Edit income source">
      <EditIncomeContent id={id} />
    </FormSheet>
  );
}
