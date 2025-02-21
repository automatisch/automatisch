import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';

import createTemplateAction from '../../../../controllers/api/v1/admin/templates/create-template.ee.js';

const router = Router();

router.post('/', authenticateUser, authorizeAdmin, createTemplateAction);

export default router;
