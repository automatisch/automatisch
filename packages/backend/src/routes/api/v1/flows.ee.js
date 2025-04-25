import { Router } from 'express';
import getFlowAction from '../../../controllers/api/v1/flows/get-flow.ee.js';
import deleteFlowAction from '../../../controllers/api/v1/flows/delete-flow.ee.js';

const router = Router();

router.get('/:flowId', getFlowAction);
router.delete('/:flowId', deleteFlowAction);

export default router;
