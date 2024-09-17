import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import getUsersAction from '../../../../controllers/api/v1/admin/users/get-users.ee.js';
import createUserAction from '../../../../controllers/api/v1/admin/users/create-user.js';
import getUserAction from '../../../../controllers/api/v1/admin/users/get-user.ee.js';
import updateUserAction from '../../../../controllers/api/v1/admin/users/update-user.ee.js';
import deleteUserAction from '../../../../controllers/api/v1/admin/users/delete-user.js';

const router = Router();

router.get('/', authenticateUser, authorizeAdmin, getUsersAction);
router.post('/', authenticateUser, authorizeAdmin, createUserAction);
router.get('/:userId', authenticateUser, authorizeAdmin, getUserAction);
router.patch('/:userId', authenticateUser, authorizeAdmin, updateUserAction);
router.delete('/:userId', authenticateUser, authorizeAdmin, deleteUserAction);

export default router;
