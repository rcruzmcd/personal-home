import { notFound } from "next/navigation";
import { FormSheet } from "@/components/form-sheet";
import { formatShortDate } from "@/lib/format";
import {
  StatementContent,
  pendingStatementFor,
} from "../../../../accounts/[id]/statement/statement-content";

export default async function RecordStatementSheet({
  params,
}: PageProps<"/accounts/[id]/statement">) {
  const { id } = await params;
  const result = await pendingStatementFor(id);
  if (!result) notFound();

  return (
    <FormSheet
      title="Record statement"
      description={
        result.pending
          ? `${result.account.name} · closed ${formatShortDate(result.pending.closingDate)}`
          : result.account.name
      }
    >
      <StatementContent id={id} />
    </FormSheet>
  );
}
