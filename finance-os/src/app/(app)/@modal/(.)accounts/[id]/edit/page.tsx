import { notFound } from "next/navigation";
import { FormSheet } from "@/components/form-sheet";
import { EditAccountContent, accountName } from "../../../../accounts/account-form-content";

export default async function EditAccountSheet({ params }: PageProps<"/accounts/[id]/edit">) {
  const { id } = await params;
  const name = await accountName(id);
  if (!name) notFound();

  return (
    <FormSheet title="Edit account" description={name}>
      <EditAccountContent id={id} />
    </FormSheet>
  );
}
