import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeUser } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import { checkTemplatesEnabled } from '../../../../helpers/check-templates-enabled.js';

import getTemplatesAction from '../../../../controllers/internal/api/v1/templates/get-templates.ee.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeUser,
  checkIsEnterprise,
  checkTemplatesEnabled,
  getTemplatesAction
);

export default router;
