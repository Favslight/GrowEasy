import Papa from 'papaparse';
import { CsvRecord } from '../types/import';

const parse = (content: string): CsvRecord[] => {
  const result = Papa.parse<CsvRecord>(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    transformHeader: (header: string): string => header.trim(),
    transform: (value: string): string => value.trim(),
  });

  return result.data;
};

export const CsvParserService = {
  parse,
};
