"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/**
 * Dims and blocks its positioned ancestor while a mutation is in flight.
 * The ancestor needs `relative`; pass `className="rounded-xl"` only when
 * that ancestor has visible rounded corners of its own (e.g.
 * AlertDialogContent) — a bare `<form>` inside a padded Card doesn't need
 * rounding since the Card's own padding already keeps the overlay off its
 * rounded edges.
 */
export function LoadingOverlay({ show, className }: { show: boolean; className?: string }) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-xs",
        className,
      )}
    >
      <Spinner className="size-6 text-purple" />
    </div>
  );
}
