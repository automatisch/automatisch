import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getPermissionsCatalogAction from '../../../../controllers/api/v1/admin/permissions/get-permissions-catalog.ee.js';

const router = Router();

router.get(
  '/catalog',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getPermissionsCatalogAction)
);

export default router;
