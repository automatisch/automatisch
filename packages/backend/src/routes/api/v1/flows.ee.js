import { Router } from 'express';
import createFlowAction from '../../../controllers/api/v1/flows/create-flow.ee.js';
import deleteFlowAction from '../../../controllers/api/v1/flows/delete-flow.ee.js';
import getFlowAction from '../../../controllers/api/v1/flows/get-flow.ee.js';
import getFlowsAction from '../../../controllers/api/v1/flows/get-flows.ee.js';
import updateFlowStatusAction from '../../../controllers/api/v1/flows/update-flow-status.ee.js';

const router = Router();

router.get('/', getFlowsAction);
router.post('/', createFlowAction);
router.get('/:flowId', getFlowAction);
router.delete('/:flowId', deleteFlowAction);
router.patch('/:flowId/status', updateFlowStatusAction);

export default router;
