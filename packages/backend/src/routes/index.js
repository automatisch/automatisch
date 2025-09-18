import { Router } from 'express';
import webhooksRouter from '@/routes/webhooks.js';
import paddleRouter from '@/routes/paddle.ee.js';
import healthcheckRouter from '@/routes/healthcheck.js';
import apiRouter from '@/routes/api/index.js';
import internalApiRouter from '@/routes/internal/api/index.js';
import mcpRouter from '@/routes/api/v1/mcp.ee.js';
import { checkIsEnterprise } from '@/helpers/check-is-enterprise.js';

const router = Router();

router.use('/webhooks', webhooksRouter);
router.use('/paddle', paddleRouter);
router.use('/healthcheck', healthcheckRouter);
router.use('/api', apiRouter);
router.use('/api/v1/mcp', checkIsEnterprise, mcpRouter);
router.use('/internal/api', internalApiRouter);

export default router;
