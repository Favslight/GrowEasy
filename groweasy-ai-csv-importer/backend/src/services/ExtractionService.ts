import type { ExtractionResult } from '../schemas/crm.schema';
import type { AIProvider } from '../providers/AIProvider';
import type { ParsedCsvRow } from '../types/ai';
import { StructuredOutputValidator } from './StructuredOutputValidator';
import { RetryService, DEFAULT_MAX_RETRIES } from './RetryService';

export interface ExtractBatchOptions {
  maxRetries?: number;
  label?: string;
}

/**
 * Orchestrates a single batch through the AI extraction pipeline:
 *   AIProvider → Structured Output → Zod Validation → Accepted | Retry
 */
const extractBatch = async (
  batch: ParsedCsvRow[],
  provider: AIProvider,
  options: ExtractBatchOptions = {}
): Promise<ExtractionResult> =>
  RetryService.execute(
    async () => {
      const raw = await provider.extract(batch);
      return StructuredOutputValidator.validate(raw);
    },
    {
      maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
      label: options.label,
    }
  );

export const ExtractionService = {
  extractBatch,
};
