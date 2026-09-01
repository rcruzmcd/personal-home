import { PageHeaderSkeleton, StatCardGridSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton />
      <StatCardGridSkeleton count={2} columns={2} rows={4} featured />
    </main>
  );
}
