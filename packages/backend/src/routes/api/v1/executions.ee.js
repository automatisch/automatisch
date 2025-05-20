import { Router } from 'express';
import getExecutionsAction from '../../../controllers/api/v1/executions/get-executions.ee.js';
import getExecutionAction from '../../../controllers/api/v1/executions/get-execution.ee.js';

const router = Router();

router.get('/', getExecutionsAction);
router.get('/:executionId', getExecutionAction);

export default router;
