import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { allowInstallation } from '../../../../helpers/allow-installation.js';
import createUserAction from '../../../../controllers/api/v1/installation/users/create-user.js';

const router = Router();

router.post(
  '/',
  allowInstallation,
  asyncHandler(createUserAction)
);

export default router;
