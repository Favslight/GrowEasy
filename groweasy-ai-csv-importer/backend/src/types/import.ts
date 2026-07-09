export type CsvRecord = Record<string, string>;

export interface ParsedCsv {
  headers: string[];
  records: CsvRecord[];
}

export interface NormalizedCsv {
  headers: string[];
  records: CsvRecord[];
}

export interface ChunkedCsv {
  chunks: CsvRecord[][];
  chunkSize: number;
  totalChunks: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
}
