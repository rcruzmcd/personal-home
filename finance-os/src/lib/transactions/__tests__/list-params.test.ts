import { describe, expect, it } from "vitest";
import { parseTransactionListParams, transactionListHref } from "../list-params";

describe("parseTransactionListParams", () => {
  it("defaults when no searchParams are given", () => {
    expect(parseTransactionListParams(undefined)).toEqual({
      page: 1,
      pageSize: 10,
      sort: "date",
      dir: "desc",
    });
  });

  it("passes through valid values", () => {
    expect(
      parseTransactionListParams({ page: "3", pageSize: "25", sort: "amount", dir: "asc" }),
    ).toEqual({ page: 3, pageSize: 25, sort: "amount", dir: "asc" });
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
  it("always includes all four params explicitly", () => {
    const href = transactionListHref("acc-1", { page: 2, pageSize: 25, sort: "amount", dir: "asc" });
    expect(href).toBe("/transactions/account/acc-1?page=2&pageSize=25&sort=amount&dir=asc");
  });
});
