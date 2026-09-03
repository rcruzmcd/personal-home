import { FormPage } from "@/components/form-page";
import { NewTransactionContent } from "../transaction-form-content";

export default function NewTransactionPage() {
  return (
    <FormPage title="Add transaction" breadcrumb={[{ label: "Transactions", href: "/transactions" }]}>
      <NewTransactionContent />
    </FormPage>
  );
}
