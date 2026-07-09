import type { ParsedCsvRow } from '../types/ai';

/**
 * Abstraction over any AI extraction backend.
 * Returns raw structured output — validation is a separate pipeline step.
 */
export interface AIProvider {
  extract(batch: ParsedCsvRow[]): Promise<unknown>;
}
