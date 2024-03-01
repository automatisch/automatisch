import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import getAppAction from '../../../controllers/api/v1/apps/get-app.js';
import getAppsAction from '../../../controllers/api/v1/apps/get-apps.js';
import getAuthAction from '../../../controllers/api/v1/apps/get-auth.js';
import getTriggersAction from '../../../controllers/api/v1/apps/get-triggers.js';

const router = Router();

router.get('/', authenticateUser, asyncHandler(getAppsAction));
router.get('/:appKey', authenticateUser, asyncHandler(getAppAction));
router.get('/:appKey/auth', authenticateUser, asyncHandler(getAuthAction));

router.get(
  '/:appKey/triggers',
  authenticateUser,
  asyncHandler(getTriggersAction)
);

export default router;
