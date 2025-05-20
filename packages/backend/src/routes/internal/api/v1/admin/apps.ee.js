import { Router } from 'express';
import { authenticateUser } from '../../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../../helpers/check-is-enterprise.js';
import createConfigAction from '../../../../../controllers/internal/api/v1/admin/apps/create-config.ee.js';
import updateConfigAction from '../../../../../controllers/internal/api/v1/admin/apps/update-config.ee.js';
import getOAuthClientsAction from '../../../../../controllers/internal/api/v1/admin/apps/get-oauth-clients.ee.js';
import getOAuthClientAction from '../../../../../controllers/internal/api/v1/admin/apps/get-oauth-client.ee.js';
import createOAuthClientAction from '../../../../../controllers/internal/api/v1/admin/apps/create-oauth-client.ee.js';
import updateOAuthClientAction from '../../../../../controllers/internal/api/v1/admin/apps/update-oauth-client.ee.js';

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
  '/:appKey/oauth-clients',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getOAuthClientsAction
);

router.post(
  '/:appKey/oauth-clients',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  createOAuthClientAction
);

router.get(
  '/:appKey/oauth-clients/:oauthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getOAuthClientAction
);

router.patch(
  '/:appKey/oauth-clients/:oauthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  updateOAuthClientAction
);

export default router;
