import { ListCardsSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton actions={1} />
      <ListCardsSkeleton count={5} showValue actionCount={4} actionStyle="icon" />
    </main>
  );
}
