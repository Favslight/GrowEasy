import type { CrmRecord, SkippedRecord } from '@/types/csv';
import { CRM_FIELD_ORDER } from '@/types/csv';

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const escapeCsv = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportRecordsAsJson = (records: CrmRecord[], filename: string): void => {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
};

export const exportRecordsAsCsv = (records: CrmRecord[], filename: string): void => {
  if (records.length === 0) {
    return;
  }

  const rows = records.map((record) =>
    CRM_FIELD_ORDER.map((header) => escapeCsv(record[header] ?? '')).join(','),
  );
  const csv = [CRM_FIELD_ORDER.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};

export const exportSkippedAsJson = (records: SkippedRecord[], filename: string): void => {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
};

export const exportSkippedAsCsv = (records: SkippedRecord[], filename: string): void => {
  if (records.length === 0) {
    return;
  }

  const headers: (keyof SkippedRecord)[] = [
    'name',
    'email',
    'country_code',
    'mobile_without_country_code',
    'reason',
  ];
  const rows = records.map((record) =>
    headers.map((header) => escapeCsv(record[header] ?? '')).join(','),
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};
