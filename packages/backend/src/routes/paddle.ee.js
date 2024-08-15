import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import webhooksHandler from '../controllers/paddle/webhooks.ee.js';

const router = Router();

router.post('/webhooks', asyncHandler(webhooksHandler));

export default router;
