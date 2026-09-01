import {
  FormCardSkeleton,
  PageHeaderSkeleton,
  StatCardGridSkeleton,
  TransactionListSkeleton,
} from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton subtitle actions={1} />
      <StatCardGridSkeleton count={2} columns={2} rows={4} />
      <FormCardSkeleton layout="inline" />
      <FormCardSkeleton title rows={3} twoColumn={false} className="w-full max-w-none" />
      <TransactionListSkeleton count={6} />
    </main>
  );
}
