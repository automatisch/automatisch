import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getFlowsAction from '../../../controllers/api/v1/flows/get-flows.js';
import getFlowAction from '../../../controllers/api/v1/flows/get-flow.js';
import updateFlowAction from '../../../controllers/api/v1/flows/update-flow.js';
import createFlowAction from '../../../controllers/api/v1/flows/create-flow.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getFlowsAction);
router.get('/:flowId', authenticateUser, authorizeUser, getFlowAction);
router.post('/', authenticateUser, authorizeUser, createFlowAction);
router.patch('/:flowId', authenticateUser, authorizeUser, updateFlowAction);

export default router;
