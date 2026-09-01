// Browser-side file parsing for transaction import. Runs in the client
// (import-wizard.tsx) so the mapping/preview step never round-trips the raw
// file to the server — only the mapped rows the user confirmed are sent.
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { ParsedFile } from "./types";

export async function parseImportFile(file: File): Promise<ParsedFile> {
  const isXlsx = /\.xlsx?$/i.test(file.name);
  const rows = isXlsx ? await parseXlsx(file) : await parseCsv(file);
  const nonEmpty = rows.filter((row) => row.some((cell) => cell.trim() !== ""));
  if (nonEmpty.length === 0) return { headers: [], rows: [] };

  const [headers, ...body] = nonEmpty;
  return { headers, rows: body };
}

async function parseCsv(file: File): Promise<string[][]> {
  const text = await file.text();
  const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
  return result.data;
}

async function parseXlsx(file: File): Promise<string[][]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, raw: false, defval: "" });
}
