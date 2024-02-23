import { Router } from 'express';
import versionAction from '../../../controllers/api/v1/automatisch/version.js';
import notificationsAction from '../../../controllers/api/v1/automatisch/notifications.js';

const router = Router();

router.get('/version', versionAction);
router.get('/notifications', notificationsAction);

export default router;
