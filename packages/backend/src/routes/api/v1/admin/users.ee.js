import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import getUsersAction from '../../../../controllers/api/v1/admin/users/get-users.ee.js';
import getUserAction from '../../../../controllers/api/v1/admin/users/get-user.ee.js';
import deleteUserAction from '../../../../controllers/api/v1/admin/users/delete-user.js';

const router = Router();

router.get('/', authenticateUser, authorizeAdmin, asyncHandler(getUsersAction));

router.get(
  '/:userId',
  authenticateUser,
  authorizeAdmin,
  asyncHandler(getUserAction)
);

router.delete(
  '/:userId',
  authenticateUser,
  authorizeAdmin,
  asyncHandler(deleteUserAction)
);

export default router;
