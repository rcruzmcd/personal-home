import { notFound } from "next/navigation";
import { FormPage } from "@/components/form-page";
import { formatShortDate } from "@/lib/format";
import { StatementContent, pendingStatementFor } from "./statement-content";

export default async function RecordStatementPage({
  params,
}: PageProps<"/accounts/[id]/statement">) {
  const { id } = await params;
  const result = await pendingStatementFor(id);
  if (!result) notFound();

  return (
    <FormPage
      title="Record statement"
      breadcrumb={[
        { label: "Accounts", href: "/accounts" },
        { label: result.account.name, href: `/accounts/${id}` },
      ]}
      description={result.pending ? `Closed ${formatShortDate(result.pending.closingDate)}` : undefined}
    >
      <StatementContent id={id} />
    </FormPage>
  );
}
