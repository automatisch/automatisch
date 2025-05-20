import { Router } from 'express';
import getAppAction from '../../../controllers/api/v1/apps/get-app.ee.js';
import getAppsAction from '../../../controllers/api/v1/apps/get-apps.ee.js';

const router = Router();

router.get('/', getAppsAction);
router.get('/:appKey', getAppAction);

export default router;
