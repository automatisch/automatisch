import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import checkIsCloud from '../../../helpers/check-is-cloud.js';
import getCurrentUserAction from '../../../controllers/api/v1/users/get-current-user.js';
import getUserTrialAction from '../../../controllers/api/v1/users/get-user-trial.ee.js';
import getInvoicesAction from '../../../controllers/api/v1/users/get-invoices.ee.js';
import getSubscriptionAction from '../../../controllers/api/v1/users/get-subscription.ee.js';

const router = Router();

router.get('/me', authenticateUser, asyncHandler(getCurrentUserAction));
router.get(
  '/invoices',
  authenticateUser,
  checkIsCloud,
  asyncHandler(getInvoicesAction)
);

router.get(
  '/:userId/trial',
  authenticateUser,
  checkIsCloud,
  asyncHandler(getUserTrialAction)
);

router.get(
  '/:userId/subscription',
  authenticateUser,
  checkIsCloud,
  asyncHandler(getSubscriptionAction)
);

export default router;
