import { describe, expect, test } from "vitest";
import {
  buildMonthEvents,
  buildMonthGrid,
  monthWindow,
  sumEventAmounts,
  type CalendarAccount,
  type CalendarIncomeSource,
  type CalendarRecurringExpense,
} from "../calendar";

const SEPTEMBER = monthWindow(2026, 9);

const card: CalendarAccount = {
  id: "card",
  name: "Chase Sapphire",
  active: true,
  due_day: 14,
  statement_day: 17,
  minimum_payment: 215,
};

function build(overrides: {
  accounts?: CalendarAccount[];
  recurringExpenses?: CalendarRecurringExpense[];
  incomeSources?: CalendarIncomeSource[];
  window?: { start: Date; end: Date };
}) {
  return buildMonthEvents({
    accounts: overrides.accounts ?? [],
    recurringExpenses: overrides.recurringExpenses ?? [],
    incomeSources: overrides.incomeSources ?? [],
    window: overrides.window ?? SEPTEMBER,
  });
}

describe("monthWindow", () => {
  test("is half-open over the calendar month", () => {
    expect(SEPTEMBER.start).toEqual(new Date(2026, 8, 1));
    expect(SEPTEMBER.end).toEqual(new Date(2026, 9, 1));
  });

  test("rolls December into the next January", () => {
    expect(monthWindow(2026, 12).end).toEqual(new Date(2027, 0, 1));
  });
});

describe("buildMonthEvents", () => {
  test("an account with both days yields a due and a statement event", () => {
    const events = build({ accounts: [card] });
    expect(events.map((e) => [e.kind, e.date.getDate(), e.amount])).toEqual([
      ["due", 14, 215],
      ["statement", 17, null],
    ]);
    expect(events[0].href).toBe("/accounts/card");
    expect(events[1].label).toBe("Chase Sapphire closes");
  });

  test("an inactive account contributes nothing", () => {
    expect(build({ accounts: [{ ...card, active: false }] })).toEqual([]);
  });

  test("a day-31 due date clamps in February", () => {
    const events = build({
      accounts: [{ ...card, due_day: 31, statement_day: null }],
      window: monthWindow(2026, 2),
    });
    expect(events).toHaveLength(1);
    expect(events[0].date).toEqual(new Date(2026, 1, 28));
  });

  test("recurring expenses and income land on their own dates", () => {
    const events = build({
      recurringExpenses: [
        { id: "r1", name: "Netflix", amount: 20, frequency: "monthly", next_date: "2026-10-12", active: true },
      ],
      incomeSources: [
        {
          id: "i1",
          name: "Severance",
          amount: 42000,
          frequency: "one_time",
          expected_date: "2026-09-06",
          start_date: null,
          end_date: null,
        },
      ],
    });
    expect(events.map((e) => [e.kind, e.date.getDate()])).toEqual([
      ["income", 6],
      ["recurring", 12],
    ]);
    expect(events[0].href).toBe("/income/i1/edit");
    expect(events[1].href).toBe("/recurring/r1/edit");
  });

  test("events sharing a day order by kind, then by amount descending", () => {
    const events = build({
      accounts: [
        { ...card, id: "a", name: "Card A", due_day: 5, statement_day: 5, minimum_payment: 100 },
      ],
      recurringExpenses: [
        { id: "r1", name: "Small", amount: 20, frequency: "monthly", next_date: "2026-09-05", active: true },
        { id: "r2", name: "Large", amount: 900, frequency: "monthly", next_date: "2026-09-05", active: true },
      ],
    });
    expect(events.map((e) => [e.kind, e.label])).toEqual([
      ["due", "Card A"],
      ["statement", "Card A closes"],
      ["recurring", "Large"],
      ["recurring", "Small"],
    ]);
  });

  test("ids are unique when one source recurs within the month", () => {
    const events = build({
      recurringExpenses: [
        { id: "r1", name: "Weekly", amount: 10, frequency: "weekly", next_date: "2026-09-04", active: true },
      ],
    });
    expect(events.length).toBeGreaterThan(1);
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length);
  });
});

describe("sumEventAmounts", () => {
  test("totals only the requested kind and ignores null amounts", () => {
    const events = build({
      accounts: [card],
      recurringExpenses: [
        { id: "r1", name: "Netflix", amount: 20, frequency: "monthly", next_date: "2026-09-12", active: true },
      ],
    });
    expect(sumEventAmounts(events, "due")).toBe(215);
    expect(sumEventAmounts(events, "recurring")).toBe(20);
    expect(sumEventAmounts(events, "statement")).toBe(0);
    expect(sumEventAmounts(events, "income")).toBe(0);
  });
});

describe("buildMonthGrid", () => {
  const today = new Date(2026, 8, 20, 9, 30);

  test("is whole weeks starting on a Sunday", () => {
    const days = buildMonthGrid(SEPTEMBER, [], today);
    expect(days.length % 7).toBe(0);
    expect(days[0].date.getDay()).toBe(0);
    expect(days.at(-1)!.date.getDay()).toBe(6);
  });

  test("marks the month's own days and the borrowed padding", () => {
    const days = buildMonthGrid(SEPTEMBER, [], today);
    const inMonth = days.filter((d) => d.inMonth);
    expect(inMonth).toHaveLength(30);
    expect(inMonth[0].date).toEqual(new Date(2026, 8, 1));
    expect(inMonth.at(-1)!.date).toEqual(new Date(2026, 8, 30));
    expect(days.filter((d) => !d.inMonth).every((d) => d.events.length === 0)).toBe(true);
  });

  test("flags today once, ignoring its time of day", () => {
    const days = buildMonthGrid(SEPTEMBER, [], today);
    const flagged = days.filter((d) => d.isToday);
    expect(flagged).toHaveLength(1);
    expect(flagged[0].date).toEqual(new Date(2026, 8, 20));
  });

  test("flags no day as today in another month", () => {
    expect(buildMonthGrid(monthWindow(2026, 11), [], today).some((d) => d.isToday)).toBe(false);
  });

  test("past days are those strictly before today", () => {
    const days = buildMonthGrid(SEPTEMBER, [], today).filter((d) => d.inMonth);
    expect(days.find((d) => d.date.getDate() === 19)!.isPast).toBe(true);
    expect(days.find((d) => d.date.getDate() === 20)!.isPast).toBe(false);
  });

  test("files each event under its own day", () => {
    const events = build({ accounts: [card] });
    const days = buildMonthGrid(SEPTEMBER, events, today);
    expect(days.find((d) => d.inMonth && d.date.getDate() === 14)!.events).toHaveLength(1);
    expect(days.find((d) => d.inMonth && d.date.getDate() === 17)!.events).toHaveLength(1);
    expect(days.flatMap((d) => d.events)).toHaveLength(events.length);
  });
});
