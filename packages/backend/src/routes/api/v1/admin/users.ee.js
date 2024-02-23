import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getUsersAction from '../../../../controllers/api/v1/admin/users/get-users.ee.js';
import getUserAction from '../../../../controllers/api/v1/admin/users/get-user.ee.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getUsersAction
);

router.get(
  '/:userId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getUserAction
);

export default router;
