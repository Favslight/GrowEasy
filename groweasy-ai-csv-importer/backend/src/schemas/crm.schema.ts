import { z } from 'zod';
import { CRM_SOURCES, CRM_STATUSES } from '../config/crm';

export const crmRecordSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    mobile: z.string(),
    status: z.enum(CRM_STATUSES),
    source: z.enum(CRM_SOURCES),
    date: z.string(),
    crm_note: z.string(),
  })
  .strict();

export const skippedRecordSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    mobile: z.string(),
    reason: z.string(),
  })
  .strict();

export const extractionResultSchema = z
  .object({
    records: z.array(crmRecordSchema),
    skipped: z.array(skippedRecordSchema),
  })
  .strict();

export type CrmRecord = z.infer<typeof crmRecordSchema>;
export type SkippedRecord = z.infer<typeof skippedRecordSchema>;
export type ExtractionResult = z.infer<typeof extractionResultSchema>;

const crmRecordJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    mobile: { type: 'string' },
    status: { type: 'string', enum: [...CRM_STATUSES] },
    source: { type: 'string', enum: [...CRM_SOURCES] },
    date: { type: 'string' },
    crm_note: { type: 'string' },
  },
  required: ['name', 'email', 'mobile', 'status', 'source', 'date', 'crm_note'],
} as const;

const skippedRecordJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    mobile: { type: 'string' },
    reason: { type: 'string' },
  },
  required: ['name', 'email', 'mobile', 'reason'],
} as const;

/**
 * Single source of truth for OpenAI Structured Outputs.
 * Enums are derived from config/crm.ts — never duplicated elsewhere.
 */
export const crmExtractionJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    records: { type: 'array', items: crmRecordJsonSchema },
    skipped: { type: 'array', items: skippedRecordJsonSchema },
  },
  required: ['records', 'skipped'],
} as const;

/**
 * Human-readable CRM schema description for the prompt builder.
 * Derived from the same field definitions as the Zod/JSON schemas.
 */
export const CRM_SCHEMA_DESCRIPTION = [
  'Each CRM record must contain exactly these fields:',
  '- name: string. Full name of the lead (empty string if unknown).',
  '- email: string. Primary (first) email address.',
  '- mobile: string. Primary (first) mobile or phone number.',
  `- status: one of [${CRM_STATUSES.join(', ')}].`,
  `- source: one of [${CRM_SOURCES.join(', ')}].`,
  '- date: string. Preserve a valid date exactly as written, otherwise empty string.',
  '- crm_note: string. Additional emails, phone numbers, and unmapped column values.',
].join('\n');
