import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { checkIsEnterprise } from '../../../helpers/check-is-enterprise.js';
import getAppAuthClientAction from '../../../controllers/api/v1/app-auth-clients/get-app-auth-client.js';
import getAppAuthClientsAction from '../../../controllers/api/v1/app-auth-clients/get-app-auth-clients.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  checkIsEnterprise,
  asyncHandler(getAppAuthClientsAction)
);

router.get(
  '/:appAuthClientId',
  authenticateUser,
  checkIsEnterprise,
  asyncHandler(getAppAuthClientAction)
);

export default router;
