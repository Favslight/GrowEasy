import { Response } from 'express';

export const notFound = (_req: unknown, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
};
