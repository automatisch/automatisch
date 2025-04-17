import { Router } from 'express';
import { authenticateUser } from '../../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../../helpers/check-is-enterprise.js';
import getPermissionsCatalogAction from '../../../../../controllers/internal/api/v1/admin/permissions/get-permissions-catalog.ee.js';

const router = Router();

router.get(
  '/catalog',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getPermissionsCatalogAction
);

export default router;
