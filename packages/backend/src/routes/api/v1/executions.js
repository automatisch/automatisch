import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getExecutionsAction from '../../../controllers/api/v1/executions/get-executions.js';
import getExecutionAction from '../../../controllers/api/v1/executions/get-execution.js';
import getExecutionStepsAction from '../../../controllers/api/v1/executions/get-execution-steps.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeUser,
  asyncHandler(getExecutionsAction)
);

router.get(
  '/:executionId',
  authenticateUser,
  authorizeUser,
  asyncHandler(getExecutionAction)
);

router.get(
  '/:executionId/execution-steps',
  authenticateUser,
  authorizeUser,
  asyncHandler(getExecutionStepsAction)
);

export default router;
