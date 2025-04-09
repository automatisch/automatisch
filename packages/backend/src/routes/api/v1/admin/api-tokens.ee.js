import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import createApiTokenAction from '../../../../controllers/api/v1/admin/api-tokens/create-api-token.ee.js';
import getApiTokensAction from '../../../../controllers/api/v1/admin/api-tokens/get-api-tokens.ee.js';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  createApiTokenAction
);

router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getApiTokensAction
);

export default router;
