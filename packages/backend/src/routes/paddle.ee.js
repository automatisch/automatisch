import { Router } from 'express';
import webhooksHandler from '../controllers/paddle/webhooks.ee.js';

const router = Router();

router.post('/webhooks', webhooksHandler);

export default router;
