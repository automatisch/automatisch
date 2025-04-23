import { Router } from 'express';
import appsRouter from './v1/apps.js';

const router = Router();

router.use('/v1/apps', appsRouter);

export default router;
