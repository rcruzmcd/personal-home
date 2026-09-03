import { CalendarGridSkeleton, PageHeaderSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton subtitle />
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-72" />
      </div>
      <CalendarGridSkeleton />
    </main>
  );
}
