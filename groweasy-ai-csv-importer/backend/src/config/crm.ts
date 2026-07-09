export const CRM_STATUSES = [
  'GOOD_LEAD_FOLLOW_UP',
  'DID_NOT_CONNECT',
  'BAD_LEAD',
  'SALE_DONE',
] as const;

export const CRM_SOURCES = [
  'leads_on_demand',
  'meridian_tower',
  'eden_park',
  'varah_swamy',
  'sarjapur_plots',
] as const;

export type CrmStatus = (typeof CRM_STATUSES)[number];
export type CrmSource = (typeof CRM_SOURCES)[number];

/** GrowEasy CRM export column order (assignment spec). */
export const CRM_FIELD_ORDER = [
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
] as const;

export type CrmFieldKey = (typeof CRM_FIELD_ORDER)[number];

/**
 * Permanent extraction instructions shared by the prompt builder.
 * Batch-specific data never belongs here.
 */
export const EXTRACTION_INSTRUCTIONS: readonly string[] = [
  'Detect fields even when CSV headers are unconventional, abbreviated, or misspelled.',
  'Infer semantic meaning from both header names and cell values (e.g. "E-mail", "Cell", "Contact No.").',
  'Map synonymous columns intelligently (e.g. "Phone" → mobile_without_country_code, "Full Name" → name).',
  'Never invent or fabricate missing values. Use an empty string when a field cannot be determined.',
  'Never guess values unless you are highly confident they are correct from the source data.',
  'Skip any row that contains NEITHER a valid email address NOR a valid mobile/phone number. Rows with at least one contact method must be imported.',
  'Never translate names. Preserve original capitalization and spelling where appropriate.',
  `crm_status must be one of: ${CRM_STATUSES.join(', ')}. Use empty string if status cannot be determined confidently.`,
  `data_source must be one of: ${CRM_SOURCES.join(', ')}. Use empty string if no source matches confidently.`,
  'The first email found becomes "email". All additional emails go into "crm_note".',
  'The first mobile/phone found becomes "mobile_without_country_code". Extract "country_code" separately when present (e.g. +91). Additional numbers go into "crm_note".',
  'created_at must be a date string parseable by JavaScript new Date(). Preserve original format when valid; otherwise use empty string.',
  'Use crm_note for remarks, follow-up notes, extra contacts, and any useful data that does not fit other fields.',
  'Use description for additional free-text context about the lead when available.',
  'Preserve unknown or unmapped column values inside crm_note rather than discarding them.',
  'Normalize whitespace only when explicitly required; otherwise preserve original values.',
  'Never return markdown, explanations, or commentary. Return only structured data.',
];
