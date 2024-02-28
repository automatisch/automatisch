import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import getAppAction from '../../../controllers/api/v1/apps/get-app.js';
import getAuthAction from '../../../controllers/api/v1/apps/get-auth.js';

const router = Router();

router.get('/:appKey', authenticateUser, asyncHandler(getAppAction));
router.get('/:appKey/auth', authenticateUser, asyncHandler(getAuthAction));

export default router;
