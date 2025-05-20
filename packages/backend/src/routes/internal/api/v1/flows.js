import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeUser } from '../../../../helpers/authorization.js';
import getFlowsAction from '../../../../controllers/internal/api/v1/flows/get-flows.js';
import getFlowAction from '../../../../controllers/internal/api/v1/flows/get-flow.js';
import getFolderAction from '../../../../controllers/internal/api/v1/flows/get-folder.js';
import updateFlowAction from '../../../../controllers/internal/api/v1/flows/update-flow.js';
import updateFlowStatusAction from '../../../../controllers/internal/api/v1/flows/update-flow-status.js';
import updateFlowFolderAction from '../../../../controllers/internal/api/v1/flows/update-flow-folder.js';
import createFlowAction from '../../../../controllers/internal/api/v1/flows/create-flow.js';
import createStepAction from '../../../../controllers/internal/api/v1/flows/create-step.js';
import deleteFlowAction from '../../../../controllers/internal/api/v1/flows/delete-flow.js';
import duplicateFlowAction from '../../../../controllers/internal/api/v1/flows/duplicate-flow.js';
import exportFlowAction from '../../../../controllers/internal/api/v1/flows/export-flow.js';
import importFlowAction from '../../../../controllers/internal/api/v1/flows/import-flow.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getFlowsAction);
router.get('/:flowId', authenticateUser, authorizeUser, getFlowAction);
router.get('/:flowId/folder', authenticateUser, authorizeUser, getFolderAction);
router.post('/', authenticateUser, authorizeUser, createFlowAction);
router.patch('/:flowId', authenticateUser, authorizeUser, updateFlowAction);

router.patch(
  '/:flowId/status',
  authenticateUser,
  authorizeUser,
  updateFlowStatusAction
);

router.patch(
  '/:flowId/folder',
  authenticateUser,
  authorizeUser,
  updateFlowFolderAction
);

router.post(
  '/:flowId/export',
  authenticateUser,
  authorizeUser,
  exportFlowAction
);

router.post('/import', authenticateUser, authorizeUser, importFlowAction);

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
