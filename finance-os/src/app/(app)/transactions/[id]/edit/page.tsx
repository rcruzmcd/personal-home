import { FormPage } from "@/components/form-page";
import { EditTransactionContent } from "../../transaction-form-content";

export default async function EditTransactionPage({
  params,
}: PageProps<"/transactions/[id]/edit">) {
  const { id } = await params;
  return (
    <FormPage title="Edit transaction" breadcrumb={[{ label: "Transactions", href: "/transactions" }]}>
      <EditTransactionContent id={id} />
    </FormPage>
  );
}
