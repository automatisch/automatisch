import { Router } from 'express';
import { authenticateUser } from '../../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../../helpers/check-is-enterprise.js';
import createApiTokenAction from '../../../../../controllers/internal/api/v1/admin/api-tokens/create-api-token.ee.js';
import getApiTokensAction from '../../../../../controllers/internal/api/v1/admin/api-tokens/get-api-tokens.ee.js';
import deleteApiTokenAction from '../../../../../controllers/internal/api/v1/admin/api-tokens/delete-api-token.ee.js';

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

router.delete(
  '/:id',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  deleteApiTokenAction
);

export default router;
