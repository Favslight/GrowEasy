import { CRM_STATUSES, CRM_SOURCES } from '../config/crm';
import type { CrmRecord, ExtractionResult } from '../schemas/crm.schema';

const isValidCreatedAt = (value: string): boolean => {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  const parsed = new Date(trimmed);
  return !Number.isNaN(parsed.getTime());
};

const sanitizeCrmStatus = (value: string): CrmRecord['crm_status'] => {
  if ((CRM_STATUSES as readonly string[]).includes(value)) {
    return value as CrmRecord['crm_status'];
  }
  return '';
};

const sanitizeDataSource = (value: string): CrmRecord['data_source'] => {
  if ((CRM_SOURCES as readonly string[]).includes(value)) {
    return value as CrmRecord['data_source'];
  }
  return '';
};

const sanitizeRecord = (record: CrmRecord): CrmRecord => ({
  ...record,
  created_at: isValidCreatedAt(record.created_at) ? record.created_at.trim() : '',
  crm_status: sanitizeCrmStatus(record.crm_status),
  data_source: sanitizeDataSource(record.data_source),
});

const sanitize = (result: ExtractionResult): ExtractionResult => ({
  records: result.records.map(sanitizeRecord),
  skipped: result.skipped,
});

export const CrmRecordPostProcessor = {
  sanitize,
};
