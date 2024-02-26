import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import versionAction from '../../../controllers/api/v1/automatisch/version.js';
import notificationsAction from '../../../controllers/api/v1/automatisch/notifications.js';
import infoAction from '../../../controllers/api/v1/automatisch/info.js';
import licenseAction from '../../../controllers/api/v1/automatisch/license.js';

const router = Router();

router.get('/version', asyncHandler(versionAction));
router.get('/notifications', asyncHandler(notificationsAction));
router.get('/info', asyncHandler(infoAction));
router.get('/license', asyncHandler(licenseAction));

export default router;
