import { Router } from 'express';
import getTemplateAction from '../../../controllers/api/v1/templates/get-template.ee.js';
import createTemplateAction from '../../../controllers/api/v1/templates/create-template.ee.js';
import deleteTemplateAction from '../../../controllers/api/v1/templates/delete-template.ee.js';
import getTemplatesAction from '../../../controllers/api/v1/templates/get-templates.ee.js';

const router = Router();

router.get('/', getTemplatesAction);
router.post('/', createTemplateAction);
router.get('/:templateId', getTemplateAction);
router.delete('/:templateId', deleteTemplateAction);

export default router;
