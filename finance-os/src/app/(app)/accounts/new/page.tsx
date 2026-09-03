import { FormPage } from "@/components/form-page";
import { NewAccountContent } from "../account-form-content";

export default function NewAccountPage() {
  return (
    <FormPage title="Add account" breadcrumb={[{ label: "Accounts", href: "/accounts" }]}>
      <NewAccountContent />
    </FormPage>
  );
}
