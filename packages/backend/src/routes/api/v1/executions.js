import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getExecutionAction from '../../../controllers/api/v1/executions/get-execution.js';

const router = Router();

router.get(
  '/:executionId',
  authenticateUser,
  authorizeUser,
  asyncHandler(getExecutionAction)
);

export default router;
