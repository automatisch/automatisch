import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getAdminAppAuthClientAction from '../../../../controllers/api/v1/admin/app-auth-clients/get-app-auth-client.ee.js';

const router = Router();

router.get(
  '/:appAuthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getAdminAppAuthClientAction)
);

export default router;
