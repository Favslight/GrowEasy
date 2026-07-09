import type { CrmRecord, ExtractionResponse, SkippedRecord } from '../types/ai';

export interface FormatExtractionInput {
  filename: string;
  records: CrmRecord[];
  skipped: SkippedRecord[];
  failedBatches: number;
}

const formatExtraction = (input: FormatExtractionInput): ExtractionResponse => ({
  success: true,
  message: 'CSV processed successfully.',
  filename: input.filename,
  summary: {
    imported: input.records.length,
    skipped: input.skipped.length,
    failedBatches: input.failedBatches,
  },
  records: input.records,
  skipped: input.skipped,
});

export const ImportResponseFormatter = {
  formatExtraction,
};
