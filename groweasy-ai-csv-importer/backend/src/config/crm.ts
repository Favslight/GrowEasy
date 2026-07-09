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

/**
 * Permanent extraction instructions shared by the prompt builder.
 * Batch-specific data never belongs here.
 */
export const EXTRACTION_INSTRUCTIONS: readonly string[] = [
  'Detect fields even when CSV headers are unconventional, abbreviated, or misspelled.',
  'Infer semantic meaning from both header names and cell values (e.g. "E-mail", "Cell", "Contact No.").',
  'Map synonymous columns intelligently (e.g. "Phone" → mobile, "Full Name" → name).',
  'Never invent or fabricate missing values. Use an empty string when a field cannot be determined.',
  'Never guess values unless you are highly confident they are correct from the source data.',
  'Skip any row that does not contain BOTH an email address AND a mobile/phone number.',
  'Never translate names. Preserve original capitalization and spelling where appropriate.',
  `Use only these CRM statuses: ${CRM_STATUSES.join(', ')}.`,
  `Use only these data sources: ${CRM_SOURCES.join(', ')}.`,
  'The first email found becomes the primary "email". All additional emails go into "crm_note".',
  'The first mobile/phone found becomes the primary "mobile". All additional numbers go into "crm_note".',
  'Preserve unknown or unmapped column values inside "crm_note" rather than discarding them.',
  'Preserve valid dates exactly as they appear. Use an empty string for missing or invalid dates.',
  'Normalize whitespace only when explicitly required; otherwise preserve original values.',
  'Never return markdown, explanations, or commentary. Return only structured data.',
];
