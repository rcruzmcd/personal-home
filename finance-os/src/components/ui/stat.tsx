import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  neutral: "text-foreground",
  positive: "text-green",
  accent: "text-purple",
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
