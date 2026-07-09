import { ChunkedCsv, CsvRecord } from '../types/import';

export const DEFAULT_CHUNK_SIZE = 50;

export const chunk = <T>(items: readonly T[], size: number = DEFAULT_CHUNK_SIZE): T[][] => {
  if (size <= 0) {
    throw new Error('Chunk size must be a positive integer.');
  }

  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
};

const chunkRecords = (
  records: CsvRecord[],
  size: number = DEFAULT_CHUNK_SIZE
): ChunkedCsv => {
  const chunks = chunk(records, size);

  return {
    chunks,
    chunkSize: size,
    totalChunks: chunks.length,
  };
};

export const ChunkService = {
  chunk: chunkRecords,
};
