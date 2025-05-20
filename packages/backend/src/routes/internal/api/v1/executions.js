import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeUser } from '../../../../helpers/authorization.js';
import getExecutionsAction from '../../../../controllers/internal/api/v1/executions/get-executions.js';
import getExecutionAction from '../../../../controllers/internal/api/v1/executions/get-execution.js';
import getExecutionStepsAction from '../../../../controllers/internal/api/v1/executions/get-execution-steps.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getExecutionsAction);

router.get(
  '/:executionId',
  authenticateUser,
  authorizeUser,
  getExecutionAction
);

router.get(
  '/:executionId/execution-steps',
  authenticateUser,
  authorizeUser,
  getExecutionStepsAction
);

export default router;
