import { Router } from 'express';
import getTemplatesAction from '../../../controllers/api/v1/templates/get-templates.ee.js';

const router = Router();

router.get('/', getTemplatesAction);

export default router;
