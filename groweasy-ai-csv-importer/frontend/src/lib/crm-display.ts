import type { CrmRecord } from '@/types/csv';

export interface EnrichedCrmRecord extends CrmRecord {
  company: string;
  city: string;
  state: string;
  country: string;
}

const NOTE_FIELD_PATTERN = /(company|city|state|country)\s*[:=]\s*([^,;|\n]+)/gi;

const parseNoteFields = (note: string): Pick<EnrichedCrmRecord, 'company' | 'city' | 'state' | 'country'> => {
  const fields = { company: '', city: '', state: '', country: '' };

  if (!note.trim()) {
    return fields;
  }

  for (const match of note.matchAll(NOTE_FIELD_PATTERN)) {
    const key = match[1]?.toLowerCase();
    const value = match[2]?.trim() ?? '';
    if (key === 'company') fields.company = value;
    if (key === 'city') fields.city = value;
    if (key === 'state') fields.state = value;
    if (key === 'country') fields.country = value;
  }

  return fields;
};

export const enrichCrmRecord = (record: CrmRecord): EnrichedCrmRecord => ({
  ...record,
  ...parseNoteFields(record.crm_note),
});

export const enrichCrmRecords = (records: CrmRecord[]): EnrichedCrmRecord[] =>
  records.map(enrichCrmRecord);

export const formatStatusLabel = (status: string): string =>
  status
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');
