import Papa from 'papaparse';
import type { CsvError, CsvRow, ParsedCsv } from '@/types/csv';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const isCsvFile = (file: File): boolean => {
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv', ''];
  const hasCsvExtension = file.name.toLowerCase().endsWith('.csv');
  return hasCsvExtension && validTypes.includes(file.type);
};

export const validateCsvFile = (file: File): CsvError | null => {
  if (!file.name.toLowerCase().endsWith('.csv') || !isCsvFile(file)) {
    return {
      code: 'INVALID_TYPE',
      message: 'Only .csv files are supported. Please choose a valid CSV file.',
    };
  }

  if (file.size === 0) {
    return {
      code: 'EMPTY',
      message: 'This file is empty. Please upload a CSV that contains data.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      code: 'TOO_LARGE',
      message: 'This file is larger than 10 MB. Please upload a smaller CSV file.',
    };
  }

  return null;
};

export const parseCsvFile = (file: File): Promise<ParsedCsv> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (results) => {
        const fatalErrors = results.errors.filter((error) => error.type !== 'FieldMismatch');

        if (fatalErrors.length > 0) {
          reject({
            code: 'PARSE_FAILED',
            message: 'We could not parse this CSV file. Please check that it is properly formatted.',
          } satisfies CsvError);
          return;
        }

        const headers = (results.meta.fields ?? []).filter((field) => field.length > 0);
        const rows = results.data.filter((row) =>
          Object.values(row).some((value) => value !== undefined && value !== null && `${value}`.trim() !== ''),
        );

        if (headers.length === 0 || rows.length === 0) {
          reject({
            code: 'EMPTY',
            message: 'This CSV does not contain any usable rows. Please upload a file with data.',
          } satisfies CsvError);
          return;
        }

        resolve({ headers, rows });
      },
      error: () => {
        reject({
          code: 'PARSE_FAILED',
          message: 'Something went wrong while reading this file. Please try again.',
        } satisfies CsvError);
      },
    });
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);

  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};
