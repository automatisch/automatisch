import { Router } from 'express';
import versionAction from '../../../controllers/api/v1/automatisch/version.js';
import notificationsAction from '../../../controllers/api/v1/automatisch/notifications.js';
import infoAction from '../../../controllers/api/v1/automatisch/info.js';
import licenseAction from '../../../controllers/api/v1/automatisch/license.js';

const router = Router();

router.get('/version', versionAction);
router.get('/notifications', notificationsAction);
router.get('/info', infoAction);
router.get('/license', licenseAction);

export default router;
