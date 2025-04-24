import { Router } from 'express';
import getExecutionsAction from '../../../controllers/api/v1/executions/get-executions.ee.js';

const router = Router();

router.get('/', getExecutionsAction);

export default router;
