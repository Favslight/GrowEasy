import { CsvRecord, NormalizedCsv, ParsedCsv } from '../types/import';

const clean = (value: string): string =>
  value
    .replace(/\r\n|\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();

const normalizeKey = (key: string): string => clean(key).replace(/\n/g, ' ').trim();

const normalize = (parsed: ParsedCsv): NormalizedCsv => {
  const headerOrder: string[] = [];
  const seenHeaders = new Set<string>();

  for (const rawHeader of parsed.headers) {
    const normalizedHeader = normalizeKey(rawHeader);
    if (normalizedHeader.length === 0 || seenHeaders.has(normalizedHeader)) {
      continue;
    }
    seenHeaders.add(normalizedHeader);
    headerOrder.push(normalizedHeader);
  }

  const records: CsvRecord[] = parsed.records.map((record) => {
    const normalizedRecord: CsvRecord = {};

    for (const [rawKey, rawValue] of Object.entries(record)) {
      const key = normalizeKey(rawKey);
      if (key.length === 0) {
        continue;
      }
      normalizedRecord[key] = clean(rawValue ?? '');
    }

    return normalizedRecord;
  });

  return { headers: headerOrder, records };
};

export const CsvNormalizer = {
  normalize,
};
