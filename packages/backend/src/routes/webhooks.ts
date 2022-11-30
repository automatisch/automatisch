import { Router } from 'express';
import webhookHandler from '../controllers/webhooks/handler';

const router = Router();

router.post('/:flowId', webhookHandler);

export default router;
