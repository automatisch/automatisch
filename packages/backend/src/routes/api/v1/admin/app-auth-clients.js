import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import getAdminAppAuthClientsAction from '../../../../controllers/api/v1/admin/app-auth-clients/get-app-auth-client.js';

const router = Router();

router.get(
  '/:appAuthClientId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getAdminAppAuthClientsAction
);

export default router;
