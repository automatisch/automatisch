import { Router } from 'express';
import graphQLInstance from '../helpers/graphql-instance';
import webhooksRouter from './webhooks';

const router = Router();

router.use('/graphql', graphQLInstance);
router.use('/webhooks', webhooksRouter);

export default router;
