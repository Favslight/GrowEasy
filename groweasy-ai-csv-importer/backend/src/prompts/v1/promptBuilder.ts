import { EXTRACTION_INSTRUCTIONS } from '../../config/crm';
import { CRM_SCHEMA_DESCRIPTION } from '../../schemas/crm.schema';
import type { ParsedCsvRow } from '../../types/ai';
import { SYSTEM_PROMPT } from './system.prompt';
import { buildUserPrompt } from './user.prompt';

export interface BuiltPrompt {
  system: string;
  user: string;
}

export const buildPrompt = (batch: ParsedCsvRow[]): BuiltPrompt => {
  const headers = batch.length > 0 ? Object.keys(batch[0]) : [];

  const user = buildUserPrompt({
    headers,
    batch,
    schemaDescription: CRM_SCHEMA_DESCRIPTION,
    instructions: EXTRACTION_INSTRUCTIONS,
  });

  return { system: SYSTEM_PROMPT, user };
};
