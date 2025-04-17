import { Router } from 'express';
import { authenticateUser } from '../../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../../helpers/check-is-enterprise.js';

import createTemplateAction from '../../../../../controllers/internal/api/v1/admin/templates/create-template.ee.js';
import getTemplatesAction from '../../../../../controllers/internal/api/v1/admin/templates/get-templates.ee.js';
import getTemplateAction from '../../../../../controllers/internal/api/v1/admin/templates/get-template.ee.js';
import updateTemplateAction from '../../../../../controllers/internal/api/v1/admin/templates/update-template.ee.js';
import deleteTemplateAction from '../../../../../controllers/internal/api/v1/admin/templates/delete-template.ee.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getTemplatesAction
);

router.get(
  '/:templateId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getTemplateAction
);

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  createTemplateAction
);

router.patch(
  '/:templateId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  updateTemplateAction
);

router.delete(
  '/:templateId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  deleteTemplateAction
);

export default router;
