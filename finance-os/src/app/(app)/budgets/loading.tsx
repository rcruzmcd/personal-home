import { PageHeaderSkeleton, ListCardsSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton subtitle />
      <ListCardsSkeleton count={8} showValue />
    </main>
  );
}
