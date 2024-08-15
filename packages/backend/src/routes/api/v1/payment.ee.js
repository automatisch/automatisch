import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import checkIsCloud from '../../../helpers/check-is-cloud.js';
import getPlansAction from '../../../controllers/api/v1/payment/get-plans.ee.js';
import getPaddleInfoAction from '../../../controllers/api/v1/payment/get-paddle-info.ee.js';

const router = Router();

router.get(
  '/plans',
  authenticateUser,
  checkIsCloud,
  asyncHandler(getPlansAction)
);

router.get(
  '/paddle-info',
  authenticateUser,
  checkIsCloud,
  asyncHandler(getPaddleInfoAction)
);

export default router;
