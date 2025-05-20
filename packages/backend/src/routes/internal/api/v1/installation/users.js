import { Router } from 'express';
import { allowInstallation } from '../../../../../helpers/allow-installation.js';
import createUserAction from '../../../../../controllers/internal/api/v1/installation/users/create-user.js';

const router = Router();

router.post('/', allowInstallation, createUserAction);

export default router;
