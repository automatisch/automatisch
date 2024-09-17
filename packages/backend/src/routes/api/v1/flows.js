import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getFlowsAction from '../../../controllers/api/v1/flows/get-flows.js';
import getFlowAction from '../../../controllers/api/v1/flows/get-flow.js';
import updateFlowAction from '../../../controllers/api/v1/flows/update-flow.js';
import updateFlowStatusAction from '../../../controllers/api/v1/flows/update-flow-status.js';
import createFlowAction from '../../../controllers/api/v1/flows/create-flow.js';
import createStepAction from '../../../controllers/api/v1/flows/create-step.js';
import deleteFlowAction from '../../../controllers/api/v1/flows/delete-flow.js';
import duplicateFlowAction from '../../../controllers/api/v1/flows/duplicate-flow.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getFlowsAction);
router.get('/:flowId', authenticateUser, authorizeUser, getFlowAction);
router.post('/', authenticateUser, authorizeUser, createFlowAction);
router.patch('/:flowId', authenticateUser, authorizeUser, updateFlowAction);

router.patch(
  '/:flowId/status',
  authenticateUser,
  authorizeUser,
  updateFlowStatusAction
);

router.post(
  '/:flowId/steps',
  authenticateUser,
  authorizeUser,
  createStepAction
);

router.post(
  '/:flowId/duplicate',
  authenticateUser,
  authorizeUser,
  duplicateFlowAction
);

router.delete('/:flowId', authenticateUser, authorizeUser, deleteFlowAction);

export default router;
