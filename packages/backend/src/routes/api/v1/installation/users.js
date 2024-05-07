import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authorizeInstallation } from '../../../../helpers/authorize-installation.js';
import createUserAction from '../../../../controllers/api/v1/installation/users/create-user.js';

const router = Router();

router.post(
  '/',
  authorizeInstallation,
  asyncHandler(createUserAction)
);

export default router;
