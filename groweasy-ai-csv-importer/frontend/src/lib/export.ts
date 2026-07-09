import type { CrmRecord, SkippedRecord } from '@/types/csv';

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportRecordsAsJson = (records: CrmRecord[], filename: string): void => {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
};

export const exportRecordsAsCsv = (records: CrmRecord[], filename: string): void => {
  if (records.length === 0) {
    return;
  }

  const headers = Object.keys(records[0]);
  const escape = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const rows = records.map((record) => headers.map((header) => escape(record[header as keyof CrmRecord] ?? '')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
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

  const headers = ['name', 'email', 'mobile', 'reason'];
  const escape = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const rows = records.map((record) => headers.map((header) => escape(record[header as keyof SkippedRecord] ?? '')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
};
