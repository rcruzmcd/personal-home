import { notFound } from "next/navigation";
import { FormPage } from "@/components/form-page";
import { EditAccountContent, accountName } from "../../account-form-content";

export default async function EditAccountPage({ params }: PageProps<"/accounts/[id]/edit">) {
  const { id } = await params;
  const name = await accountName(id);
  if (!name) notFound();

  return (
    <FormPage
      title="Edit account"
      breadcrumb={[
        { label: "Accounts", href: "/accounts" },
        { label: name, href: `/accounts/${id}` },
      ]}
    >
      <EditAccountContent id={id} />
    </FormPage>
  );
}
