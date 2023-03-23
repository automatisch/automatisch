import { Router } from 'express';
import graphQLInstance from '../helpers/graphql-instance';
import webhooksRouter from './webhooks';
import paddleRouter from './paddle.ee';

const router = Router();

router.use('/graphql', graphQLInstance);
router.use('/webhooks', webhooksRouter);
router.use('/paddle', paddleRouter);

export default router;
