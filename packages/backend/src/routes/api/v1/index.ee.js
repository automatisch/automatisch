import { Router } from 'express';
import appsRouter from './apps.ee.js';
import executionsRouter from './executions.ee.js';
import flowsRouter from './flows.ee.js';
import templatesRouter from './templates.ee.js';
import usersRouter from './users.ee.js';
import userInvitationsRouter from './user-invitations.ee.js';

const router = Router();

router.use('/apps', appsRouter);
router.use('/executions', executionsRouter);
router.use('/flows', flowsRouter);
router.use('/templates', templatesRouter);
router.use('/users', usersRouter);
router.use('/user-invitations', userInvitationsRouter);

export default router;
