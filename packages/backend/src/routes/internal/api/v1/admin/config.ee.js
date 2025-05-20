import { Router } from 'express';
import { authenticateUser } from '../../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../../helpers/check-is-enterprise.js';
import updateConfigAction from '../../../../../controllers/internal/api/v1/admin/config/update.ee.js';

const router = Router();

router.patch(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  updateConfigAction
);

export default router;
