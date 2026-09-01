import { ListCardsSkeleton, PageHeaderSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton subtitle actions={1} />
      <ListCardsSkeleton count={4} actionCount={3} actionStyle="text" />
    </main>
  );
}
