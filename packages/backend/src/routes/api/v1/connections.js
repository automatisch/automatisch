import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getFlowsAction from '../../../controllers/api/v1/connections/get-flows.js';
import createTestAction from '../../../controllers/api/v1/connections/create-test.js';

const router = Router();

router.get(
  '/:connectionId/flows',
  authenticateUser,
  authorizeUser,
  asyncHandler(getFlowsAction)
);

router.post(
  '/:connectionId/test',
  authenticateUser,
  authorizeUser,
  asyncHandler(createTestAction)
);

export default router;
