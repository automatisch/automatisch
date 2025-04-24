import { Router } from 'express';
import getFlowAction from '../../../controllers/api/v1/flows/get-flow.ee.js';

const router = Router();

router.get('/:flowId', getFlowAction);

export default router;
