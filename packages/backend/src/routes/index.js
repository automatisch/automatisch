import { Router } from 'express';
import graphQLInstance from '../helpers/graphql-instance.js';
import webhooksRouter from './webhooks.js';
import paddleRouter from './paddle.ee.js';
import healthcheckRouter from './healthcheck.js';
import automatischRouter from './api/v1/automatisch.js';

const router = Router();

router.use('/graphql', graphQLInstance);
router.use('/webhooks', webhooksRouter);
router.use('/paddle', paddleRouter);
router.use('/healthcheck', healthcheckRouter);
router.use('/api/v1/automatisch', automatischRouter);

export default router;
