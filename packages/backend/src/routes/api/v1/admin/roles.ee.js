import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getRolesAction from '../../../../controllers/api/v1/admin/roles/get-roles.ee.js';
import getRoleAction from '../../../../controllers/api/v1/admin/roles/get-role.ee.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getRolesAction
);

router.get(
  '/:roleId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getRoleAction
);

export default router;
