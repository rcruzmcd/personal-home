import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const GRID_COLUMNS: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function PageHeaderSkeleton({
  subtitle = false,
  actions = 0,
}: {
  subtitle?: boolean;
  actions?: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-56" />
        {subtitle && <Skeleton className="h-4 w-40" />}
      </div>
      {actions > 0 && (
        <div className="flex items-center gap-3">
          {Array.from({ length: actions }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-32 rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
}

export function StatCardGridSkeleton({
  count,
  columns = 2,
  rows = 3,
  featured = false,
}: {
  count: number;
  columns?: 2 | 3 | 4;
  rows?: number;
  featured?: boolean;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-6", GRID_COLUMNS[columns])}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} variant={featured ? "featured" : "standard"}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Array.from({ length: rows }).map((_, j) => (
              <div key={j} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ListCardsSkeleton({
  count,
  showValue = false,
  actionCount = 0,
  actionStyle = "icon",
}: {
  count: number;
  showValue?: boolean;
  actionCount?: number;
  actionStyle?: "icon" | "text";
}) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-56" />
          </div>
          {(showValue || actionCount > 0) && (
            <div className="flex items-center gap-4">
              {showValue && <Skeleton className="h-5 w-20" />}
              {Array.from({ length: actionCount }).map((_, j) =>
                actionStyle === "icon" ? (
                  <Skeleton key={j} className="size-9 rounded-md" />
                ) : (
                  <Skeleton key={j} className="h-4 w-12" />
                ),
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

export function CardListSkeleton({
  rows,
  featured = false,
}: {
  rows: number;
  featured?: boolean;
}) {
  return (
    <Card variant={featured ? "featured" : "standard"}>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent>
        {rows === 0 ? (
          <Skeleton className="h-8 w-40" />
        ) : (
          <div className="flex flex-col gap-2">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function FormCardSkeleton({
  title = true,
  rows = 4,
  twoColumn = true,
  layout = "stacked",
  className,
}: {
  title?: boolean;
  rows?: number;
  twoColumn?: boolean;
  layout?: "stacked" | "inline";
  className?: string;
}) {
  if (layout === "inline") {
    return (
      <Card className={cn("flex items-end gap-3", className)}>
        <div className="flex-1">
          <Skeleton className="h-3.5 w-32 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-12 w-32 rounded-lg" />
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-lg", className)}>
      {title && (
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
      )}
      <CardContent className="flex flex-col gap-4">
        <div className={twoColumn ? "grid grid-cols-2 gap-4" : "flex flex-col gap-4"}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3.5 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function TransactionListSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-col divide-y divide-border bg-surface rounded-xl">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between px-6 py-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}
