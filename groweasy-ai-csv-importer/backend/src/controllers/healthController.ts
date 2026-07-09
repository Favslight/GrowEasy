import { Response } from 'express';

export const getHealth = (_req: unknown, res: Response): void => {
  res.json({
    status: 'ok',
    service: 'LeadSense API',
    version: '1.0.0',
  });
};
