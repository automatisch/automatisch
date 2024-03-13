import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getConnectionAction from '../../../controllers/api/v1/steps/get-connection.js';

const router = Router();

router.get(
  '/:stepId/connection',
  authenticateUser,
  authorizeUser,
  asyncHandler(getConnectionAction)
);

export default router;
