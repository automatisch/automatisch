import { Router } from 'express';
import getAppsAction from '../../../controllers/api/v1/apps/get-apps.ee.js';

const router = Router();

router.get('/', getAppsAction);

export default router;
