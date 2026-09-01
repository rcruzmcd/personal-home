import type { CalcIncomeSource } from "./types";
import { MS_PER_DAY } from "./date-math";

/** Half-open date range: [start, end). */
export type Period = { start: Date; end: Date };

/**
 * Expected income for one future period — docs/PERSONAL_FINANCE_REQUIREMENTS.md
 * §8 "Expected Income: Sum of all expected income sources for that period."
 *
 * "Expected" here means every stored source, regardless of confidence level:
 * the spec's calculation logic doesn't filter by confidence, only §11's
 * alerting layer is meant to flag low-confidence income separately.
 */
export function projectIncomeForPeriod(
  sources: readonly CalcIncomeSource[],
  period: Period,
): number {
  return sources.reduce((sum, source) => sum + projectSourceForPeriod(source, period), 0);
}

function projectSourceForPeriod(source: CalcIncomeSource, period: Period): number {
  // §7 example: a lump sum or a recurring source is always anchored to a
  // single date — "expected_date" when the source is future/uncertain,
  // otherwise "start_date" (e.g. a salary already in progress).
  const anchor = source.expected_date ?? source.start_date;
  if (!anchor) return 0;
  const anchorDate = new Date(anchor);
  const endBound = source.end_date ? new Date(source.end_date) : null;

  switch (source.frequency) {
    case "one_time":
      return anchorDate >= period.start && anchorDate < period.end ? source.amount : 0;

    case "monthly": {
      const startsAfterPeriod = anchorDate >= period.end;
      const endsBeforePeriod = endBound !== null && endBound < period.start;
      return startsAfterPeriod || endsBeforePeriod ? 0 : source.amount;
    }

    case "weekly":
      return countWeeklyOccurrences(anchorDate, endBound, period) * source.amount;

    default:
      return 0;
  }
}

/** Counts weekly occurrences (7-day cadence from anchorDate) that fall within [period.start, period.end) and on/before endBound. */
function countWeeklyOccurrences(anchorDate: Date, endBound: Date | null, period: Period): number {
  const hardStop = endBound ?? period.end;
  if (period.start >= period.end || anchorDate > hardStop) return 0;

  // Jump straight to the first occurrence on/after period.start instead of
  // iterating week-by-week from anchorDate, which could be arbitrarily far
  // in the past relative to the forecast window.
  const msFromAnchorToPeriodStart = period.start.getTime() - anchorDate.getTime();
  const weeksToSkip = Math.max(0, Math.ceil(msFromAnchorToPeriodStart / (7 * MS_PER_DAY)));
  let occurrence = new Date(anchorDate.getTime() + weeksToSkip * 7 * MS_PER_DAY);

  let count = 0;
  while (occurrence < period.end && occurrence <= hardStop) {
    if (occurrence >= period.start) count++;
    occurrence = new Date(occurrence.getTime() + 7 * MS_PER_DAY);
  }
  return count;
}
