import { describe, expect, test } from "vitest";
import { findPendingStatements, type StatementAccount } from "../statements";

// Local midnight throughout — the detector compares against dates resolved
// from a day-of-month, which are built from local parts.
const ASOF = new Date(2026, 8, 20); // 20 Sep 2026

function account(overrides: Partial<StatementAccount>): StatementAccount {
  return {
    id: "card",
    name: "Chase Sapphire",
    type: "credit_card",
    active: true,
    statement_day: 17,
    due_day: 14,
    ...overrides,
  };
}

describe("findPendingStatements", () => {
  test("flags the most recent close when nothing is recorded", () => {
    const pending = findPendingStatements({
      accounts: [account({})],
      recorded: [],
      asOfDate: ASOF,
    });
    expect(pending).toHaveLength(1);
    expect(pending[0].accountId).toBe("card");
    expect(pending[0].closingDate).toEqual(new Date(2026, 8, 17));
    expect(pending[0].daysSinceClose).toBe(3);
  });

  test("does not flag once that close is recorded", () => {
    expect(
      findPendingStatements({
        accounts: [account({})],
        recorded: [{ account_id: "card", closing_date: "2026-09-17" }],
        asOfDate: ASOF,
      }),
    ).toEqual([]);
  });

  test("a recorded earlier cycle does not satisfy the current one", () => {
    const pending = findPendingStatements({
      accounts: [account({})],
      recorded: [{ account_id: "card", closing_date: "2026-08-17" }],
      asOfDate: ASOF,
    });
    expect(pending).toHaveLength(1);
    expect(pending[0].closingDate).toEqual(new Date(2026, 8, 17));
  });

  test("another account's record does not satisfy this one", () => {
    expect(
      findPendingStatements({
        accounts: [account({})],
        recorded: [{ account_id: "other", closing_date: "2026-09-17" }],
        asOfDate: ASOF,
      }),
    ).toHaveLength(1);
  });

  test("reports only the latest close when several are unrecorded", () => {
    // A year of neglect is still one prompt — a backlog nobody can clear is noise.
    const pending = findPendingStatements({
      accounts: [account({})],
      recorded: [],
      asOfDate: new Date(2027, 8, 20),
    });
    expect(pending).toHaveLength(1);
    expect(pending[0].closingDate).toEqual(new Date(2027, 8, 17));
  });

  test("uses last month's close when this month's has not arrived", () => {
    const pending = findPendingStatements({
      accounts: [account({})],
      recorded: [],
      asOfDate: new Date(2026, 8, 3),
    });
    expect(pending[0].closingDate).toEqual(new Date(2026, 7, 17));
  });

  test("clamps a day-31 close in February", () => {
    const pending = findPendingStatements({
      accounts: [account({ statement_day: 31 })],
      recorded: [],
      asOfDate: new Date(2026, 2, 5),
    });
    expect(pending[0].closingDate).toEqual(new Date(2026, 1, 28));
  });

  test("resolves a due day that falls in the month after the close", () => {
    // Amex: closes the 28th, due the 3rd — the 3rd of the *next* month.
    const pending = findPendingStatements({
      accounts: [account({ statement_day: 28, due_day: 3 })],
      recorded: [],
      asOfDate: new Date(2026, 8, 30),
    });
    expect(pending[0].closingDate).toEqual(new Date(2026, 8, 28));
    expect(pending[0].dueDate).toEqual(new Date(2026, 9, 3));
  });

  test("a due day equal to the statement day falls due the following month", () => {
    // A payment is never due the instant the statement closes.
    const pending = findPendingStatements({
      accounts: [account({ statement_day: 17, due_day: 17 })],
      recorded: [],
      asOfDate: ASOF,
    });
    expect(pending[0].closingDate).toEqual(new Date(2026, 8, 17));
    expect(pending[0].dueDate).toEqual(new Date(2026, 9, 17));
  });

  test("a due day that clamps onto the closing date rolls to the next month", () => {
    // Closing on the 30th and due on the 31st both land on Feb 28.
    const pending = findPendingStatements({
      accounts: [account({ statement_day: 30, due_day: 31 })],
      recorded: [],
      asOfDate: new Date(2026, 2, 5),
    });
    expect(pending[0].closingDate).toEqual(new Date(2026, 1, 28));
    expect(pending[0].dueDate).toEqual(new Date(2026, 2, 31));
  });

  test("leaves dueDate null when the account has no due day", () => {
    const pending = findPendingStatements({
      accounts: [account({ due_day: null })],
      recorded: [],
      asOfDate: ASOF,
    });
    expect(pending[0].dueDate).toBeNull();
  });

  test("ignores inactive accounts", () => {
    expect(
      findPendingStatements({
        accounts: [account({ active: false })],
        recorded: [],
        asOfDate: ASOF,
      }),
    ).toEqual([]);
  });

  test("ignores accounts with no statement day", () => {
    expect(
      findPendingStatements({
        accounts: [account({ statement_day: null })],
        recorded: [],
        asOfDate: ASOF,
      }),
    ).toEqual([]);
  });

  test("ignores asset accounts, which have no billing cycle", () => {
    expect(
      findPendingStatements({
        accounts: [account({ type: "checking" }), account({ type: "savings" })],
        recorded: [],
        asOfDate: ASOF,
      }),
    ).toEqual([]);
  });

  test("covers loans and mortgages, not just cards", () => {
    const pending = findPendingStatements({
      accounts: [
        account({ id: "loan", type: "auto_loan" }),
        account({ id: "mortgage", type: "mortgage" }),
      ],
      recorded: [],
      asOfDate: ASOF,
    });
    expect(pending.map((p) => p.accountId).sort()).toEqual(["loan", "mortgage"]);
  });

  test("orders the longest outstanding first", () => {
    const pending = findPendingStatements({
      accounts: [
        account({ id: "recent", statement_day: 19 }),
        account({ id: "stale", statement_day: 2 }),
      ],
      recorded: [],
      asOfDate: ASOF,
    });
    expect(pending.map((p) => p.accountId)).toEqual(["stale", "recent"]);
  });
});
