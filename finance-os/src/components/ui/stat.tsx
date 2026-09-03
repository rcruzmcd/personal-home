import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  neutral: "text-foreground",
  positive: "text-green",
  accent: "text-purple",
  // Only for a figure that is genuinely wrong to leave as it is — an exceeded
  // budget, not merely a negative number. The label beside it always says so
  // in words too, so the color is never the only signal.
  danger: "text-red",
} as const;

export type StatTone = keyof typeof TONE_CLASSES;

/**
 * A labelled headline number — the unit a page header uses to answer "how is
 * this doing?" before the user scrolls. Label above value (not beside it) so
 * several stats line up as a row of equal-width columns.
 */
export function Stat({
  label,
  value,
  tone = "neutral",
  className,
}: {
  label: string;
  value: string;
  tone?: StatTone;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-small text-muted">{label}</p>
      <p className={cn("text-h2 font-bold", TONE_CLASSES[tone])}>{value}</p>
    </div>
  );
}
