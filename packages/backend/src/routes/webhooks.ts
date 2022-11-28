import createAction from '../controllers/webhooks/create';
import { Router } from 'express';

const router = Router();

router.post('/:flowId', createAction);

export default router;
