import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BudgetLine } from "@/lib/calculations";

// Under/near/over map onto green/purple/red. Color is never the only signal —
// the line beneath always states the figure in words (WCAG 1.4.1), which is
// also why an unbudgeted row renders no bar at all rather than an empty one.
const STATUS_FILL: Record<string, string> = {
  under: "bg-green",
  near: "bg-purple",
  over: "bg-red",
};

/**
 * One category's spend against its limit. The bar caps at 100% — an overrun is
 * carried by the color and the "$60 over" text rather than by a bar that runs
 * off its track.
 */
export function BudgetMeter({ line }: { line: BudgetLine }) {
  if (line.limit === null || line.remaining === null) {
    return (
      <p className="text-small text-muted">
        {line.spent > 0
          ? `${formatCurrency(line.spent)} spent · no limit set`
          : "No limit set"}
      </p>
    );
  }

  const over = line.remaining < 0;

  return (
    <div className="flex flex-col gap-1.5">
      <Progress
        value={line.spent}
        max={line.limit}
        indicatorClassName={STATUS_FILL[line.status] ?? "bg-purple"}
        aria-label={`${line.categoryName} budget`}
      />
      <p className={cn("text-small", over ? "font-medium text-red" : "text-muted")}>
        {formatCurrency(line.spent)} of {formatCurrency(line.limit)}
        {" · "}
        {over
          ? `${formatCurrency(-line.remaining)} over`
          : `${formatCurrency(line.remaining)} left`}
      </p>
    </div>
  );
}
