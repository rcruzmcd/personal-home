import { CardListSkeleton, PageHeaderSkeleton, StatCardGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton />
      <StatCardGridSkeleton count={4} columns={4} rows={3} />
      <CardListSkeleton rows={3} />
    </main>
  );
}
