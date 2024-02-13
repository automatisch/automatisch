import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import getCurrentUserAction from '../../../controllers/api/v1/users/get-current-user.js';

const router = Router();

router.get('/me', authenticateUser, getCurrentUserAction);

export default router;
