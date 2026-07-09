import { HttpError } from '../utils/httpError';
import { AiConfigurationError } from '../utils/errors';
import { logger } from '../utils/logger';
import type { ParsedCsv } from '../types/import';
import type { AIProvider } from '../providers/AIProvider';
import type { CrmRecord, ExtractionResponse, SkippedRecord } from '../types/ai';
import { CsvParserService } from './CsvParserService';
import { CsvNormalizer } from './CsvNormalizer';
import { ChunkService } from './ChunkService';
import { ExtractionService } from './ExtractionService';
import { ImportResponseFormatter } from './ImportResponseFormatter';
import { OpenAIProvider } from '../providers/OpenAIProvider';

const processUpload = async (
  file: Express.Multer.File | undefined,
  provider: AIProvider = OpenAIProvider
): Promise<ExtractionResponse> => {
  if (!file) {
    throw new HttpError(400, 'No file was uploaded.');
  }

  logger.info('upload started', { filename: file.originalname, size: file.size });

  if (!file.buffer || file.buffer.length === 0) {
    throw new HttpError(400, 'The uploaded CSV file is empty.');
  }

  const content = file.buffer.toString('utf-8');

  let records: ParsedCsv['records'];
  try {
    records = CsvParserService.parse(content);
  } catch {
    throw new HttpError(400, 'The CSV file is malformed and could not be parsed.');
  }

  if (records.length === 0) {
    throw new HttpError(400, 'The CSV file does not contain any data rows.');
  }

  const parsed: ParsedCsv = {
    headers: Object.keys(records[0]),
    records,
  };

  const normalized = CsvNormalizer.normalize(parsed);

  if (normalized.headers.length === 0) {
    throw new HttpError(400, 'The CSV file is missing valid column headers.');
  }

  logger.info('parsing completed', {
    rows: normalized.records.length,
    columns: normalized.headers.length,
  });

  const chunked = ChunkService.chunk(normalized.records);

  const importedRecords: CrmRecord[] = [];
  const skippedRecords: SkippedRecord[] = [];
  let failedBatches = 0;

  for (let index = 0; index < chunked.chunks.length; index += 1) {
    const batch = chunked.chunks[index];
    const batchNumber = index + 1;
    const batchLabel = `batch ${batchNumber}/${chunked.totalChunks}`;

    logger.info('chunk started', {
      batch: batchNumber,
      of: chunked.totalChunks,
      size: batch.length,
    });

    try {
      const result = await ExtractionService.extractBatch(batch, provider, {
        label: batchLabel,
      });

      importedRecords.push(...result.records);
      skippedRecords.push(...result.skipped);

      logger.info('chunk completed', {
        batch: batchNumber,
        imported: result.records.length,
        skipped: result.skipped.length,
      });
    } catch (error) {
      if (error instanceof AiConfigurationError) {
        throw error;
      }

      failedBatches += 1;
      logger.error('chunk failed', {
        batch: batchNumber,
        reason: error instanceof Error ? error.name : 'unknown',
      });
    }
  }

  logger.info('extraction completed', {
    imported: importedRecords.length,
    skipped: skippedRecords.length,
    failedBatches,
  });

  if (failedBatches === chunked.totalChunks) {
    throw new HttpError(
      502,
      'AI extraction failed for every batch. Please verify your OpenAI configuration and try again.'
    );
  }

  return ImportResponseFormatter.formatExtraction({
    filename: file.originalname,
    records: importedRecords,
    skipped: skippedRecords,
    failedBatches,
  });
};

export const ImportService = {
  processUpload,
};
