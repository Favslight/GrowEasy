import type { ParsedCsvRow } from '../../types/ai';

export interface UserPromptInput {
  headers: string[];
  batch: ParsedCsvRow[];
  schemaDescription: string;
  instructions: readonly string[];
}

export const buildUserPrompt = ({
  headers,
  batch,
  schemaDescription,
  instructions,
}: UserPromptInput): string => {
  const instructionList = instructions.map((rule, index) => `${index + 1}. ${rule}`).join('\n');

  return `Extract CRM records from the batch below. This data comes from a real-world CRM export and may have unconventional headers, missing fields, or inconsistent formatting.

CSV HEADERS:
${JSON.stringify(headers)}

CRM SCHEMA:
${schemaDescription}

EXTRACTION INSTRUCTIONS:
${instructionList}

CURRENT BATCH (${batch.length} rows):
${JSON.stringify(batch)}

Return a JSON object with:
- "records": successfully extracted CRM records from valid rows.
- "skipped": rows that could not be imported, each with a concise "reason".`;
};
