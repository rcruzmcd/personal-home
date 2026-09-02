import { describe, expect, it } from "vitest";
import {
  escapeLikePattern,
  parseTransactionListParams,
  periodRange,
  transactionListHref,
} from "../list-params";

describe("parseTransactionListParams", () => {
  it("defaults when no searchParams are given", () => {
    expect(parseTransactionListParams(undefined)).toEqual({
      page: 1,
      pageSize: 10,
      sort: "date",
      dir: "desc",
      q: "",
      year: null,
      month: null,
    });
  });

  it("passes through valid values", () => {
    expect(
      parseTransactionListParams({
        page: "3",
        pageSize: "25",
        sort: "amount",
        dir: "asc",
        q: " coffee ",
        year: "2026",
        month: "8",
      }),
    ).toEqual({
      page: 3,
      pageSize: 25,
      sort: "amount",
      dir: "asc",
      q: "coffee",
      year: 2026,
      month: 8,
    });
  });

  it("drops a month with no year, since it can't be turned into a range", () => {
    expect(parseTransactionListParams({ month: "8" })).toMatchObject({ year: null, month: null });
  });

  it("drops an out-of-range month or year", () => {
    expect(parseTransactionListParams({ year: "2026", month: "13" }).month).toBeNull();
    expect(parseTransactionListParams({ year: "not-a-year" }).year).toBeNull();
  });

  it("clamps an out-of-range or non-numeric pageSize to the default", () => {
    expect(parseTransactionListParams({ pageSize: "999" }).pageSize).toBe(10);
    expect(parseTransactionListParams({ pageSize: "abc" }).pageSize).toBe(10);
  });

  it("clamps an invalid sort or dir to the default", () => {
    expect(parseTransactionListParams({ sort: "merchant" }).sort).toBe("date");
    expect(parseTransactionListParams({ dir: "sideways" }).dir).toBe("desc");
  });

  it("clamps a non-numeric or non-positive page to 1", () => {
    expect(parseTransactionListParams({ page: "abc" }).page).toBe(1);
    expect(parseTransactionListParams({ page: "0" }).page).toBe(1);
    expect(parseTransactionListParams({ page: "-2" }).page).toBe(1);
  });

  it("unwraps a string[] value (Next's searchParams shape) to its first entry", () => {
    expect(parseTransactionListParams({ sort: ["amount", "date"] }).sort).toBe("amount");
  });
});

describe("transactionListHref", () => {
  const base = {
    page: 2,
    pageSize: 25,
    sort: "amount",
    dir: "asc",
    q: "",
    year: null,
    month: null,
  } as const;

  it("always includes the four paging/sort params explicitly", () => {
    expect(transactionListHref("acc-1", { ...base })).toBe(
      "/transactions/account/acc-1?page=2&pageSize=25&sort=amount&dir=asc",
    );
  });

  it("appends the search and timeframe when set", () => {
    expect(
      transactionListHref("acc-1", { ...base, q: "whole foods", year: 2026, month: 8 }),
    ).toBe(
      "/transactions/account/acc-1?page=2&pageSize=25&sort=amount&dir=asc&q=whole+foods&year=2026&month=8",
    );
  });

  it("omits a month with no year, matching what the parser would accept back", () => {
    expect(transactionListHref("acc-1", { ...base, month: 8 })).not.toContain("month");
  });
});

describe("periodRange", () => {
  it("returns null when no year is selected", () => {
    expect(periodRange(null, null)).toBeNull();
    expect(periodRange(null, 8)).toBeNull();
  });

  it("spans a whole year when no month is selected", () => {
    expect(periodRange(2026, null)).toEqual({ start: "2026-01-01", end: "2026-12-31" });
  });

  it("ends on the real last day of the month", () => {
    expect(periodRange(2026, 2)).toEqual({ start: "2026-02-01", end: "2026-02-28" });
    expect(periodRange(2024, 2)).toEqual({ start: "2024-02-01", end: "2024-02-29" });
    expect(periodRange(2026, 11)).toEqual({ start: "2026-11-01", end: "2026-11-30" });
  });
});

describe("escapeLikePattern", () => {
  it("escapes wildcards so they match literally", () => {
    expect(escapeLikePattern("50% off")).toBe("50\\% off");
    expect(escapeLikePattern("a_b")).toBe("a\\_b");
    expect(escapeLikePattern("back\\slash")).toBe("back\\\\slash");
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeLikePattern("Whole Foods")).toBe("Whole Foods");
  });
});
