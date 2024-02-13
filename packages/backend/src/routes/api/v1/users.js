import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getCurrentUserAction from '../../../controllers/api/v1/users/get-current-user.js';
import getUserAction from '../../../controllers/api/v1/users/get-user.js';
import getUsersAction from '../../../controllers/api/v1/users/get-users.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getUsersAction);
router.get('/me', authenticateUser, getCurrentUserAction);
router.get('/:userId', authenticateUser, authorizeUser, getUserAction);

export default router;
