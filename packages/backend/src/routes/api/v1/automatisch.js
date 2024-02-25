import { Router } from 'express';
import versionAction from '../../../controllers/api/v1/automatisch/version.js';
import notificationsAction from '../../../controllers/api/v1/automatisch/notifications.js';
import infoAction from '../../../controllers/api/v1/automatisch/info.js';

const router = Router();

router.get('/version', versionAction);
router.get('/notifications', notificationsAction);
router.get('/info', infoAction);

export default router;
