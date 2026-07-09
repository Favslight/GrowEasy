'use client';

import { useCallback, useState } from 'react';
import { parseCsvFile, validateCsvFile } from '@/lib/csv';
import type { CsvError, CsvFileMeta, ParsedCsv } from '@/types/csv';

interface UseCsvUploadReturn {
  file: File | null;
  data: ParsedCsv | null;
  fileMeta: CsvFileMeta | null;
  error: CsvError | null;
  isParsing: boolean;
  uploadFile: (file: File) => Promise<void>;
  reset: () => void;
}

export const useCsvUpload = (): UseCsvUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ParsedCsv | null>(null);
  const [fileMeta, setFileMeta] = useState<CsvFileMeta | null>(null);
  const [error, setError] = useState<CsvError | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const reset = useCallback((): void => {
    setFile(null);
    setData(null);
    setFileMeta(null);
    setError(null);
    setIsParsing(false);
  }, []);

  const uploadFile = useCallback(async (file: File): Promise<void> => {
    setError(null);
    setData(null);
    setFileMeta(null);
    setFile(null);

    const validationError = validateCsvFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsParsing(true);

    try {
      const parsed = await parseCsvFile(file);
      setData(parsed);
      setFileMeta({ name: file.name, size: file.size });
      setFile(file);
    } catch (caughtError) {
      const csvError = caughtError as CsvError;
      setError(
        csvError?.code
          ? csvError
          : {
              code: 'PARSE_FAILED',
              message: 'We could not process this file. Please try again.',
            },
      );
    } finally {
      setIsParsing(false);
    }
  }, []);

  return { file, data, fileMeta, error, isParsing, uploadFile, reset };
};
