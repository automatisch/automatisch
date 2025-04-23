import { Router } from 'express';
import { authenticateUser } from '../../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../../helpers/check-is-enterprise.js';
import createRoleAction from '../../../../../controllers/internal/api/v1/admin/roles/create-role.ee.js';
import getRolesAction from '../../../../../controllers/internal/api/v1/admin/roles/get-roles.ee.js';
import getRoleAction from '../../../../../controllers/internal/api/v1/admin/roles/get-role.ee.js';
import updateRoleAction from '../../../../../controllers/internal/api/v1/admin/roles/update-role.ee.js';
import deleteRoleAction from '../../../../../controllers/internal/api/v1/admin/roles/delete-role.ee.js';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  createRoleAction
);

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

router.patch(
  '/:roleId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  updateRoleAction
);

router.delete(
  '/:roleId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  deleteRoleAction
);

export default router;
