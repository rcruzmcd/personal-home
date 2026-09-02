import { FormPage } from "@/components/form-page";
import { AccountForm } from "../account-form";
import { createAccount } from "../actions";

export default function NewAccountPage() {
  return (
    <FormPage title="Add account" breadcrumb={[{ label: "Accounts", href: "/accounts" }]}>
      <AccountForm action={createAccount} submitLabel="Add account" />
    </FormPage>
  );
}
