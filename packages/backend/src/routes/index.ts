import { Router } from 'express';
import graphQLInstance from '../helpers/graphql-instance';
import webhooksRouter from './webhooks';
import stripeRouter from './stripe.ee';

const router = Router();

router.use('/graphql', graphQLInstance);
router.use('/webhooks', webhooksRouter);
router.use('/stripe', stripeRouter);

export default router;
