import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import mime from 'mime-types';
import { HttpError } from '../utils/httpError';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const UPLOAD_FIELD_NAME = 'file';

const ACCEPTED_MIME_TYPES = new Set<string>([
  'text/csv',
  'application/csv',
  'application/vnd.ms-excel',
  'text/plain',
]);

const isCsvUpload = (originalName: string, mimeType: string): boolean => {
  const hasCsvExtension = originalName.toLowerCase().endsWith('.csv');
  const extensionMime = mime.lookup(originalName);
  const extensionIsCsv = extensionMime === 'text/csv';
  const mimeAllowed = ACCEPTED_MIME_TYPES.has(mimeType);

  return hasCsvExtension && extensionIsCsv && mimeAllowed;
};

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (isCsvUpload(file.originalname, file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new HttpError(400, 'Only CSV files are allowed.'));
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter,
});

export const uploadCsv = (req: Request, res: Response, next: NextFunction): void => {
  const handler = upload.single(UPLOAD_FIELD_NAME);

  handler(req, res, (err: unknown): void => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        next(new HttpError(400, 'File exceeds the maximum size of 10 MB.'));
        return;
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
        next(new HttpError(400, 'Only a single CSV file may be uploaded.'));
        return;
      }

      next(new HttpError(400, 'The file upload could not be processed.'));
      return;
    }

    if (err) {
      next(err);
      return;
    }

    next();
  });
};
