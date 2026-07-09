import { extractionResultSchema, type ExtractionResult } from '../schemas/crm.schema';
import { ExtractionValidationError } from '../utils/errors';
import { CrmRecordPostProcessor } from './CrmRecordPostProcessor';

/**
 * Dedicated validation layer for AI structured output.
 * Never trust model output without passing through this validator.
 */
const validate = (data: unknown): ExtractionResult => {
  const result = extractionResultSchema.safeParse(data);

  if (!result.success) {
    throw new ExtractionValidationError();
  }

  return CrmRecordPostProcessor.sanitize(result.data);
};

export const StructuredOutputValidator = {
  validate,
};
