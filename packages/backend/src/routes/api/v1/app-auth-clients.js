import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { checkIsEnterprise } from '../../../helpers/check-is-enterprise.js';
import getAppAuthClientAction from '../../../controllers/api/v1/app-auth-clients/get-app-auth-client.js';

const router = Router();

router.get(
  '/:appAuthClientId',
  authenticateUser,
  checkIsEnterprise,
  getAppAuthClientAction
);

export default router;
