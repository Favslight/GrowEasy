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

/** GrowEasy CRM record — matches assignment field names. */
export interface CrmRecord {
  created_at: string;
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
  company: string;
  city: string;
  state: string;
  country: string;
  lead_owner: string;
  crm_status: string;
  crm_note: string;
  data_source: string;
  possession_time: string;
  description: string;
}

export const CRM_FIELD_ORDER: (keyof CrmRecord)[] = [
  'created_at',
  'name',
  'email',
  'country_code',
  'mobile_without_country_code',
  'company',
  'city',
  'state',
  'country',
  'lead_owner',
  'crm_status',
  'crm_note',
  'data_source',
  'possession_time',
  'description',
];

export interface SkippedRecord {
  name: string;
  email: string;
  country_code: string;
  mobile_without_country_code: string;
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
