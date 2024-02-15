import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import checkIsCloud from '../../../helpers/check-is-cloud.js';
import getCurrentUserAction from '../../../controllers/api/v1/users/get-current-user.js';
import getUserAction from '../../../controllers/api/v1/users/get-user.js';
import getUsersAction from '../../../controllers/api/v1/users/get-users.js';
import getUserTrialAction from '../../../controllers/api/v1/users/get-user-trial.ee.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getUsersAction);
router.get('/me', authenticateUser, getCurrentUserAction);
router.get('/:userId', authenticateUser, authorizeUser, getUserAction);
router.get(
  '/:userId/trial',
  authenticateUser,
  checkIsCloud,
  getUserTrialAction
);

export default router;
