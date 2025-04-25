import { Router } from 'express';
import appsRouter from './v1/apps.ee.js';
import executionsRouter from './v1/executions.ee.js';
import flowsRouter from './v1/flows.ee.js';
import foldersRouter from './v1/folders.ee.js';
import usersRouter from './v1/users.ee.js';
import templatesRouter from './v1/templates.ee.js';

const router = Router();

router.use('/v1/apps', appsRouter);
router.use('/v1/flows', flowsRouter);
router.use('/v1/executions', executionsRouter);
router.use('/v1/folders', foldersRouter);
router.use('/v1/users', usersRouter);
router.use('/v1/templates', templatesRouter);

export default router;
