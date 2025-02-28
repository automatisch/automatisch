import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';

import createTemplateAction from '../../../../controllers/api/v1/admin/templates/create-template.ee.js';
import getTemplatesAction from '../../../../controllers/api/v1/admin/templates/get-templates.ee.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getTemplatesAction
);

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  createTemplateAction
);

export default router;
