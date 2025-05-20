import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeUser } from '../../../../helpers/authorization.js';
import getConnectionAction from '../../../../controllers/internal/api/v1/steps/get-connection.js';
import testStepAction from '../../../../controllers/internal/api/v1/steps/test-step.js';
import getPreviousStepsAction from '../../../../controllers/internal/api/v1/steps/get-previous-steps.js';
import createDynamicFieldsAction from '../../../../controllers/internal/api/v1/steps/create-dynamic-fields.js';
import createDynamicDataAction from '../../../../controllers/internal/api/v1/steps/create-dynamic-data.js';
import deleteStepAction from '../../../../controllers/internal/api/v1/steps/delete-step.js';
import updateStepAction from '../../../../controllers/internal/api/v1/steps/update-step.js';
import executeStepAction from '../../../../controllers/internal/api/v1/steps/execute-step.js';

const router = Router();

router.get(
  '/:stepId/connection',
  authenticateUser,
  authorizeUser,
  getConnectionAction
);

router.post('/:stepId/test', authenticateUser, authorizeUser, testStepAction);

router.get(
  '/:stepId/previous-steps',
  authenticateUser,
  authorizeUser,
  getPreviousStepsAction
);

router.post(
  '/:stepId/dynamic-fields',
  authenticateUser,
  authorizeUser,
  createDynamicFieldsAction
);

router.post(
  '/:stepId/dynamic-data',
  authenticateUser,
  authorizeUser,
  createDynamicDataAction
);

router.post(
  '/:stepId/execute',
  authenticateUser,
  authorizeUser,
  executeStepAction
);

router.patch('/:stepId', authenticateUser, authorizeUser, updateStepAction);
router.delete('/:stepId', authenticateUser, authorizeUser, deleteStepAction);

export default router;
