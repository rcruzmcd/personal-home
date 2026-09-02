// Shared types for CSV/XLSX transaction import
// (docs/PERSONAL_FINANCE_REQUIREMENTS.md §3, "Transaction Import").

export type ParsedFile = {
  headers: string[];
  rows: string[][];
};

/**
 * How a bank's export encodes the transaction amount. Most use one signed
 * `amount` column; others (common on credit-card and business-account
 * statements) split money out and money in across separate debit and credit
 * columns, with only one of the two filled per row.
 */
export type AmountMode = "single" | "credit_debit";

export type ColumnMapping = {
  date: string;
  description: string;
  merchant: string | null;
  amountMode: AmountMode;
  /** Used when amountMode is "single". */
  amount: string;
  /** Used when amountMode is "credit_debit" — money out and money in. */
  debit: string;
  credit: string;
};

export type MappedTransaction = {
  row: number;
  date: string;
  description: string;
  merchant: string | null;
  amount: number;
  type: "expense" | "income";
  import_id: string;
  duplicateInFile: boolean;
};

export type MapRowsResult = {
  transactions: MappedTransaction[];
  errors: { row: number; message: string }[];
};

export type ImportSummary = {
  imported: number;
  duplicates: number;
  total: number;
};
