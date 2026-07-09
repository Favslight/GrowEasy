import { Response } from 'express';
import { HttpError } from '../utils/httpError';

export const errorHandler = (
  err: Error,
  _req: unknown,
  res: Response,
  _next: unknown
): void => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error('Error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
