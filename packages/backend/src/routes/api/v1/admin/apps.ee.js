import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import createConfigAction from '../../../../controllers/api/v1/admin/apps/create-config.ee.js';
import updateConfigAction from '../../../../controllers/api/v1/admin/apps/update-config.ee.js';
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
  createConfigAction
);

router.patch(
  '/:appKey/config',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  updateConfigAction
);

router.get(
  '/:appKey/auth-clients',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getAuthClientsAction
);

router.post(
  '/:appKey/auth-clients',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  createAuthClientAction
);

router.get(
  '/:appKey/auth-clients/:appAuthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getAuthClientAction
);

router.patch(
  '/:appKey/auth-clients/:appAuthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  updateAuthClientAction
);

export default router;
