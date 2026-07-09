import { z } from 'zod';
import { CRM_FIELD_ORDER, CRM_SOURCES, CRM_STATUSES } from '../config/crm';

const crmStatusSchema = z.union([z.enum(CRM_STATUSES), z.literal('')]);
const dataSourceSchema = z.union([z.enum(CRM_SOURCES), z.literal('')]);

export const crmRecordSchema = z
  .object({
    created_at: z.string(),
    name: z.string(),
    email: z.string(),
    country_code: z.string(),
    mobile_without_country_code: z.string(),
    company: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    lead_owner: z.string(),
    crm_status: crmStatusSchema,
    crm_note: z.string(),
    data_source: dataSourceSchema,
    possession_time: z.string(),
    description: z.string(),
  })
  .strict();

export const skippedRecordSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    country_code: z.string(),
    mobile_without_country_code: z.string(),
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

const crmRecordProperties = {
  created_at: { type: 'string' },
  name: { type: 'string' },
  email: { type: 'string' },
  country_code: { type: 'string' },
  mobile_without_country_code: { type: 'string' },
  company: { type: 'string' },
  city: { type: 'string' },
  state: { type: 'string' },
  country: { type: 'string' },
  lead_owner: { type: 'string' },
  crm_status: { type: 'string', enum: [...CRM_STATUSES, ''] },
  crm_note: { type: 'string' },
  data_source: { type: 'string', enum: [...CRM_SOURCES, ''] },
  possession_time: { type: 'string' },
  description: { type: 'string' },
} as const;

const crmRecordJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: crmRecordProperties,
  required: [...CRM_FIELD_ORDER],
} as const;

const skippedRecordJsonSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    country_code: { type: 'string' },
    mobile_without_country_code: { type: 'string' },
    reason: { type: 'string' },
  },
  required: ['name', 'email', 'country_code', 'mobile_without_country_code', 'reason'],
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
  'Each CRM record must contain exactly these GrowEasy CRM fields:',
  '- created_at: string. Lead creation date parseable by new Date(). Empty string if unknown.',
  '- name: string. Full name of the lead.',
  '- email: string. Primary (first) email address.',
  '- country_code: string. Country dialing code (e.g. +91). Empty string if unknown.',
  '- mobile_without_country_code: string. Primary mobile number without country code.',
  '- company: string. Company or organization name.',
  '- city: string. City.',
  '- state: string. State or province.',
  '- country: string. Country name.',
  '- lead_owner: string. Assigned lead owner (often an email).',
  `- crm_status: one of [${CRM_STATUSES.join(', ')}] or empty string.`,
  '- crm_note: string. Remarks, follow-ups, extra emails/phones, unmapped values.',
  `- data_source: one of [${CRM_SOURCES.join(', ')}] or empty string.`,
  '- possession_time: string. Property possession time when applicable.',
  '- description: string. Additional description or context.',
].join('\n');
