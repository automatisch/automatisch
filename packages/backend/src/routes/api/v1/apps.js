import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import getAppAction from '../../../controllers/api/v1/apps/get-app.js';

const router = Router();

router.get('/:appKey', authenticateUser, asyncHandler(getAppAction));

export default router;
