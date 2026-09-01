// Shared types for CSV/XLSX transaction import
// (docs/PERSONAL_FINANCE_REQUIREMENTS.md §3, "Transaction Import").

export type ParsedFile = {
  headers: string[];
  rows: string[][];
};

export type ColumnMapping = {
  date: string;
  description: string;
  amount: string;
  merchant: string | null;
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
