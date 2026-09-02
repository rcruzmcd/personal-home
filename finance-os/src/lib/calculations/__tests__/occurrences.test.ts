import { describe, expect, test } from "vitest";
import { incomeOccurrencesIn, recurringOccurrencesIn } from "../occurrences";

// September 2026, the window shape the calendar always passes.
const SEPTEMBER = { start: new Date(2026, 8, 1), end: new Date(2026, 9, 1) };

describe("recurringOccurrencesIn", () => {
  test("an inactive expense contributes nothing", () => {
    expect(
      recurringOccurrencesIn(
        { frequency: "monthly", next_date: "2026-09-12", active: false },
        SEPTEMBER,
      ),
    ).toEqual([]);
  });

  test("an expense with no anchor contributes nothing", () => {
    expect(
      recurringOccurrencesIn({ frequency: "monthly", next_date: null, active: true }, SEPTEMBER),
    ).toEqual([]);
  });

  test("daily fills every day of the window", () => {
    const dates = recurringOccurrencesIn(
      { frequency: "daily", next_date: "2026-09-01", active: true },
      SEPTEMBER,
    );
    expect(dates).toHaveLength(30);
    expect(dates[0]).toEqual(new Date(2026, 8, 1));
    expect(dates[29]).toEqual(new Date(2026, 8, 30));
  });

  test("monthly still lands this month when the anchor is next month", () => {
    // next_date rolls forward as an expense is paid, so the anchor is routinely
    // ahead of the month being viewed — it must project backwards.
    expect(
      recurringOccurrencesIn(
        { frequency: "monthly", next_date: "2026-10-12", active: true },
        SEPTEMBER,
      ),
    ).toEqual([new Date(2026, 8, 12)]);
  });

  test("monthly anchored on the 31st clamps in February", () => {
    expect(
      recurringOccurrencesIn(
        { frequency: "monthly", next_date: "2026-01-31", active: true },
        { start: new Date(2026, 1, 1), end: new Date(2026, 2, 1) },
      ),
    ).toEqual([new Date(2026, 1, 28)]);
  });

  test("weekly projects backwards from a future anchor, ascending", () => {
    const dates = recurringOccurrencesIn(
      { frequency: "weekly", next_date: "2026-10-02", active: true },
      SEPTEMBER,
    );
    expect(dates).toEqual([
      new Date(2026, 8, 4),
      new Date(2026, 8, 11),
      new Date(2026, 8, 18),
      new Date(2026, 8, 25),
    ]);
  });

  test("weekly from a long-past anchor lands on the same weekday", () => {
    const dates = recurringOccurrencesIn(
      { frequency: "weekly", next_date: "2025-09-05", active: true },
      SEPTEMBER,
    );
    expect(dates).toHaveLength(4);
    expect(dates.every((d) => d.getDay() === dates[0].getDay())).toBe(true);
    expect(dates[0] >= SEPTEMBER.start).toBe(true);
  });

  test("annually appears only in the anchor's own month", () => {
    expect(
      recurringOccurrencesIn(
        { frequency: "annually", next_date: "2024-09-09", active: true },
        SEPTEMBER,
      ),
    ).toEqual([new Date(2026, 8, 9)]);
    expect(
      recurringOccurrencesIn(
        { frequency: "annually", next_date: "2024-03-09", active: true },
        SEPTEMBER,
      ),
    ).toEqual([]);
  });
});

describe("incomeOccurrencesIn", () => {
  const base = { expected_date: null, start_date: null, end_date: null };

  test("no anchor contributes nothing", () => {
    expect(incomeOccurrencesIn({ ...base, frequency: "one_time" }, SEPTEMBER)).toEqual([]);
  });

  test("one_time lands only inside its own window", () => {
    expect(
      incomeOccurrencesIn(
        { ...base, frequency: "one_time", expected_date: "2026-09-06" },
        SEPTEMBER,
      ),
    ).toEqual([new Date(2026, 8, 6)]);
    expect(
      incomeOccurrencesIn(
        { ...base, frequency: "one_time", expected_date: "2026-10-06" },
        SEPTEMBER,
      ),
    ).toEqual([]);
  });

  test("falls back to start_date when there is no expected_date", () => {
    expect(
      incomeOccurrencesIn({ ...base, frequency: "one_time", start_date: "2026-09-06" }, SEPTEMBER),
    ).toEqual([new Date(2026, 8, 6)]);
  });

  test("weekly never pays before its anchor", () => {
    const dates = incomeOccurrencesIn(
      { ...base, frequency: "weekly", expected_date: "2026-09-15" },
      SEPTEMBER,
    );
    expect(dates).toEqual([new Date(2026, 8, 15), new Date(2026, 8, 22), new Date(2026, 8, 29)]);
  });

  test("weekly stops after end_date", () => {
    const dates = incomeOccurrencesIn(
      { ...base, frequency: "weekly", expected_date: "2026-09-01", end_date: "2026-09-16" },
      SEPTEMBER,
    );
    expect(dates).toEqual([new Date(2026, 8, 1), new Date(2026, 8, 8), new Date(2026, 8, 15)]);
  });

  test("a source that ended before the window contributes nothing", () => {
    expect(
      incomeOccurrencesIn(
        { ...base, frequency: "monthly", start_date: "2026-01-10", end_date: "2026-07-10" },
        SEPTEMBER,
      ),
    ).toEqual([]);
  });

  test("monthly recurs from its anchor but not before it", () => {
    expect(
      incomeOccurrencesIn({ ...base, frequency: "monthly", start_date: "2026-01-10" }, SEPTEMBER),
    ).toEqual([new Date(2026, 8, 10)]);
    expect(
      incomeOccurrencesIn({ ...base, frequency: "monthly", start_date: "2026-10-10" }, SEPTEMBER),
    ).toEqual([]);
  });
});
