import { PageHeaderSkeleton } from "@/components/skeletons";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-1 flex flex-col gap-6 px-10 py-16">
      <PageHeaderSkeleton />
      <Card className="flex flex-col gap-4">
        <div>
          <Skeleton className="h-3.5 w-20 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-3.5 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    </main>
  );
}
