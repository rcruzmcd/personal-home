import { CardListSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton subtitle />
      <CardListSkeleton rows={2} />
      <CardListSkeleton rows={3} />
      <CardListSkeleton rows={2} />
      <CardListSkeleton rows={2} />
    </main>
  );
}
