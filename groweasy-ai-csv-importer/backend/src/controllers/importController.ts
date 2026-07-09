import { NextFunction, Request, Response } from 'express';
import { ImportService } from '../services/ImportService';

const handleImport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await ImportService.processUpload(req.file);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const ImportController = {
  handleImport,
};
