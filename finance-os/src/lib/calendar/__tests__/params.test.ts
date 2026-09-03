import { describe, expect, test } from "vitest";
import { calendarHref, currentMonth } from "../params";

const TODAY = new Date(2026, 8, 20); // 20 Sep 2026

// The month-window logic itself is covered in src/lib/__tests__/month-params.test.ts;
// all that is /calendar-specific is the base path it builds onto.
describe("calendarHref", () => {
  test("keeps the current month query-less", () => {
    expect(calendarHref(currentMonth(TODAY), TODAY)).toBe("/calendar");
  });

  test("names any other month", () => {
    expect(calendarHref({ year: 2026, month: 10 }, TODAY)).toBe("/calendar?y=2026&m=10");
  });
});
