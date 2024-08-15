import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import checkIsCloud from '../../../helpers/check-is-cloud.js';
import getCurrentUserAction from '../../../controllers/api/v1/users/get-current-user.js';
import getUserTrialAction from '../../../controllers/api/v1/users/get-user-trial.ee.js';
import getAppsAction from '../../../controllers/api/v1/users/get-apps.js';
import getInvoicesAction from '../../../controllers/api/v1/users/get-invoices.ee.js';
import getSubscriptionAction from '../../../controllers/api/v1/users/get-subscription.ee.js';
import getPlanAndUsageAction from '../../../controllers/api/v1/users/get-plan-and-usage.ee.js';
import acceptInvitationAction from '../../../controllers/api/v1/users/accept-invitation.js';
import forgotPasswordAction from '../../../controllers/api/v1/users/forgot-password.js';
import resetPasswordAction from '../../../controllers/api/v1/users/reset-password.js';

const router = Router();

router.get('/me', authenticateUser, asyncHandler(getCurrentUserAction));

router.get(
  '/:userId/apps',
  authenticateUser,
  authorizeUser,
  asyncHandler(getAppsAction)
);

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

router.get(
  '/:userId/plan-and-usage',
  authenticateUser,
  checkIsCloud,
  asyncHandler(getPlanAndUsageAction)
);

router.post('/invitation', asyncHandler(acceptInvitationAction));
router.post('/forgot-password', asyncHandler(forgotPasswordAction));

router.post('/reset-password', asyncHandler(resetPasswordAction));

export default router;
