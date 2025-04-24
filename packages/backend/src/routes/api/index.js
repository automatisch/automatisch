import { Router } from 'express';
import appsRouter from './v1/apps.ee.js';
import foldersRouter from './v1/folders.ee.js';

const router = Router();

router.use('/v1/apps', appsRouter);
router.use('/v1/folders', foldersRouter);

export default router;
