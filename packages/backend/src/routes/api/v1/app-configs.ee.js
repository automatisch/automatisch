import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { checkIsEnterprise } from '../../../helpers/check-is-enterprise.js';
import getAppConfigAction from '../../../controllers/api/v1/app-configs/get-app-config.ee.js';

const router = Router();

router.get(
  '/:appKey',
  authenticateUser,
  checkIsEnterprise,
  asyncHandler(getAppConfigAction)
);

export default router;
