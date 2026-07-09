export interface CsvRow {
  [key: string]: string;
}

export interface ParsedCsv {
  headers: string[];
  rows: CsvRow[];
}

export interface CsvFileMeta {
  name: string;
  size: number;
}

export interface CsvUploadResult {
  data: ParsedCsv;
  meta: CsvFileMeta;
}

export type CsvErrorCode =
  | 'INVALID_TYPE'
  | 'TOO_LARGE'
  | 'EMPTY'
  | 'PARSE_FAILED';

export interface CsvError {
  code: CsvErrorCode;
  message: string;
}

export interface CrmRecord {
  name: string;
  email: string;
  mobile: string;
  status: string;
  source: string;
  date: string;
  crm_note: string;
}

export interface SkippedRecord {
  name: string;
  email: string;
  mobile: string;
  reason: string;
}

export interface ImportSummary {
  imported: number;
  skipped: number;
  failedBatches: number;
}

export interface ImportResponse {
  success: true;
  message: string;
  filename: string;
  summary: ImportSummary;
  records: CrmRecord[];
  skipped: SkippedRecord[];
}
