import { Router } from 'express';
import { ImportController } from '../controllers/importController';
import { uploadCsv } from '../middleware/uploadMiddleware';

const router = Router();

router.post('/import', uploadCsv, ImportController.handleImport);

export default router;
