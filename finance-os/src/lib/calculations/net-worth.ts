import {
  ASSET_ACCOUNT_TYPES,
  LIABILITY_ACCOUNT_TYPES,
  type AccountType,
  type CalcAccount,
} from "./types";

const ASSET_TYPE_SET = new Set<AccountType>(ASSET_ACCOUNT_TYPES);
const LIABILITY_TYPE_SET = new Set<AccountType>(LIABILITY_ACCOUNT_TYPES);

export type NetWorthResult = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  byType: Partial<Record<AccountType, number>>;
};

/**
 * Net worth = total assets − total liabilities, over active accounts only
 * (docs/PERSONAL_FINANCE_REQUIREMENTS.md §1, §2 "Active/inactive toggle").
 * Liability balances are positive magnitudes owed, so they're subtracted
 * rather than summed as signed values.
 */
export function calculateNetWorth(accounts: readonly CalcAccount[]): NetWorthResult {
  let totalAssets = 0;
  let totalLiabilities = 0;
  const byType: Partial<Record<AccountType, number>> = {};

  for (const account of accounts) {
    if (!account.active) continue;

    byType[account.type] = (byType[account.type] ?? 0) + account.balance;

    if (ASSET_TYPE_SET.has(account.type)) {
      totalAssets += account.balance;
    } else if (LIABILITY_TYPE_SET.has(account.type)) {
      totalLiabilities += account.balance;
    }
  }

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    byType,
  };
}
