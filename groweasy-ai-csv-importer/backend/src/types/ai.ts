import type { CsvRecord } from './import';
import type { CrmRecord, ExtractionResult, SkippedRecord } from '../schemas/crm.schema';

export type ParsedCsvRow = CsvRecord;

export type { CrmRecord, SkippedRecord, ExtractionResult };

export interface ExtractionSummary {
  imported: number;
  skipped: number;
  failedBatches: number;
}

export interface ExtractionResponse {
  success: true;
  message: string;
  filename: string;
  summary: ExtractionSummary;
  records: CrmRecord[];
  skipped: SkippedRecord[];
}
