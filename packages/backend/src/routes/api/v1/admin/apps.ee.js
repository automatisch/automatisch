import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import createConfigAction from '../../../../controllers/api/v1/admin/apps/create-config.ee.js';
import getAuthClientsAction from '../../../../controllers/api/v1/admin/apps/get-auth-clients.ee.js';
import getAuthClientAction from '../../../../controllers/api/v1/admin/apps/get-auth-client.ee.js';
import createAuthClientAction from '../../../../controllers/api/v1/admin/apps/create-auth-client.ee.js';
import updateAuthClientAction from '../../../../controllers/api/v1/admin/apps/update-auth-client.ee.js';

const router = Router();


router.post(
  '/:appKey/config',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(createConfigAction)
);

router.get(
  '/:appKey/auth-clients',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getAuthClientsAction)
);

router.post(
  '/:appKey/auth-clients',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(createAuthClientAction)
);

router.get(
  '/:appKey/auth-clients/:appAuthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getAuthClientAction)
);

router.patch(
  '/:appKey/auth-clients/:appAuthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(updateAuthClientAction)
);

export default router;
