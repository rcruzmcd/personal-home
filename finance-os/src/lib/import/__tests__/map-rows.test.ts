import { describe, expect, test } from "vitest";
import { mapRowsToTransactions, parseAmount, parseImportDate } from "../map-rows";
import type { ColumnMapping } from "../types";

describe("parseAmount", () => {
  test("parses plain numbers", () => {
    expect(parseAmount("42.50")).toBe(42.5);
    expect(parseAmount("-42.50")).toBe(-42.5);
  });

  test("strips currency symbols and thousands separators", () => {
    expect(parseAmount("$1,234.56")).toBe(1234.56);
  });

  test("treats parentheses as negative", () => {
    expect(parseAmount("(56.00)")).toBe(-56);
  });

  test("rejects blank, non-numeric, and zero amounts", () => {
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("n/a")).toBeNull();
    expect(parseAmount("0")).toBeNull();
  });
});

describe("parseImportDate", () => {
  test("passes through ISO dates", () => {
    expect(parseImportDate("2026-08-15")).toBe("2026-08-15");
  });

  test("parses US-style M/D/YYYY", () => {
    expect(parseImportDate("8/5/2026")).toBe("2026-08-05");
  });

  test("rejects invalid calendar dates", () => {
    expect(parseImportDate("2/30/2026")).toBeNull();
  });

  test("rejects garbage input", () => {
    expect(parseImportDate("not a date")).toBeNull();
  });
});

describe("mapRowsToTransactions", () => {
  const mapping: ColumnMapping = {
    date: "Date",
    description: "Description",
    merchant: null,
    amountMode: "single",
    amount: "Amount",
    debit: "",
    credit: "",
  };
  const headers = ["Date", "Description", "Amount"];

  test("maps valid rows and infers type from amount sign", () => {
    const result = mapRowsToTransactions(
      { headers, rows: [["2026-08-01", "Whole Foods", "-45.20"], ["2026-08-02", "Payroll", "1500"]] },
      mapping,
      "acct-1",
    );
    expect(result.errors).toEqual([]);
    expect(result.transactions).toHaveLength(2);
    expect(result.transactions[0].type).toBe("expense");
    expect(result.transactions[1].type).toBe("income");
  });

  test("collects a row error instead of throwing", () => {
    const result = mapRowsToTransactions(
      { headers, rows: [["not-a-date", "Whole Foods", "-45.20"]] },
      mapping,
      "acct-1",
    );
    expect(result.transactions).toEqual([]);
    expect(result.errors).toEqual([{ row: 1, message: "Invalid or missing date" }]);
  });

  test("flags repeat rows in the same file as duplicates", () => {
    const result = mapRowsToTransactions(
      {
        headers,
        rows: [
          ["2026-08-01", "Whole Foods", "-45.20"],
          ["2026-08-01", "Whole Foods", "-45.20"],
        ],
      },
      mapping,
      "acct-1",
    );
    expect(result.transactions[0].duplicateInFile).toBe(false);
    expect(result.transactions[1].duplicateInFile).toBe(true);
  });
});

describe("mapRowsToTransactions with separate debit/credit columns", () => {
  const headers = ["Date", "Description", "Debit", "Credit"];
  const mapping: ColumnMapping = {
    date: "Date",
    description: "Description",
    merchant: null,
    amountMode: "credit_debit",
    amount: "",
    debit: "Debit",
    credit: "Credit",
  };

  function map(rows: string[][]) {
    return mapRowsToTransactions({ headers, rows }, mapping, "acct-1");
  }

  test("signs debits negative and credits positive", () => {
    const result = map([
      ["2026-08-01", "Whole Foods", "45.20", ""],
      ["2026-08-02", "Payroll", "", "1500.00"],
    ]);
    expect(result.errors).toEqual([]);
    expect(result.transactions[0]).toMatchObject({ amount: -45.2, type: "expense" });
    expect(result.transactions[1]).toMatchObject({ amount: 1500, type: "income" });
  });

  test("normalizes a bank that already signs its debit column negative", () => {
    expect(map([["2026-08-01", "Whole Foods", "-45.20", ""]]).transactions[0].amount).toBe(-45.2);
  });

  test("treats a zero-filled unused column as empty", () => {
    const result = map([["2026-08-01", "Whole Foods", "45.20", "0.00"]]);
    expect(result.errors).toEqual([]);
    expect(result.transactions[0].amount).toBe(-45.2);
  });

  test("skips rows with neither a debit nor a credit", () => {
    const result = map([["2026-08-01", "Whole Foods", "", ""]]);
    expect(result.transactions).toEqual([]);
    expect(result.errors).toEqual([
      { row: 1, message: "Invalid or missing debit/credit amount" },
    ]);
  });

  test("skips ambiguous rows that fill both columns", () => {
    const result = map([["2026-08-01", "Whole Foods", "45.20", "10.00"]]);
    expect(result.transactions).toEqual([]);
    expect(result.errors).toEqual([
      { row: 1, message: "Row has both a debit and a credit amount" },
    ]);
  });

  test("works when the bank only exports one of the two columns", () => {
    const result = mapRowsToTransactions(
      { headers: ["Date", "Description", "Debit"], rows: [["2026-08-01", "Rent", "1200"]] },
      { ...mapping, credit: "" },
      "acct-1",
    );
    expect(result.transactions[0].amount).toBe(-1200);
  });
});
