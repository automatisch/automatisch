import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getAuthClientsAction from '../../../../controllers/api/v1/admin/apps/get-auth-clients.ee.js';
import getRoleAction from '../../../../controllers/api/v1/admin/roles/get-role.ee.js';

const router = Router();

router.get(
  '/:appKey/auth-clients',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getAuthClientsAction)
);

router.get(
  '/:appKey/auth-clients/:appAuthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getRoleAction)
);

export default router;
