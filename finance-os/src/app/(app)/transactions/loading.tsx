import { ListCardsSkeleton, PageHeaderSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton actions={2} />
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-40" />
        <ListCardsSkeleton count={4} />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-11 w-56 rounded-lg" />
      </div>
    </main>
  );
}
