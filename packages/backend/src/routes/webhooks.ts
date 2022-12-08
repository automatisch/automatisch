import { Router } from 'express';
import webhookHandler from '../controllers/webhooks/handler';

const router = Router();

router.get('/:flowId', webhookHandler);
router.put('/:flowId', webhookHandler);
router.patch('/:flowId', webhookHandler);
router.post('/:flowId', webhookHandler);

export default router;
