import { Router } from 'express';
import appsRouter from '@/routes/api/v1/apps.ee.js';
import executionsRouter from '@/routes/api/v1/executions.ee.js';
import flowsRouter from '@/routes/api/v1/flows.ee.js';
import templatesRouter from '@/routes/api/v1/templates.ee.js';
import usersRouter from '@/routes/api/v1/users.ee.js';
import userInvitationsRouter from '@/routes/api/v1/user-invitations.ee.js';

const router = Router();

router.use('/v1/apps', appsRouter);
router.use('/v1/executions', executionsRouter);
router.use('/v1/flows', flowsRouter);
router.use('/v1/templates', templatesRouter);
router.use('/v1/users', usersRouter);
router.use('/v1/user-invitations', userInvitationsRouter);

export default router;
