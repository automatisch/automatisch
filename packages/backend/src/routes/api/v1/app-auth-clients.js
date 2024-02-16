import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import getAppAuthClientAction from '../../../controllers/api/v1/app-auth-clients/get-app-auth-client.js';

const router = Router();

router.get('/:appAuthClientId', authenticateUser, getAppAuthClientAction);

export default router;
