import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getFlowsAction from '../../../controllers/api/v1/connections/get-flows.js';
import testConnectionAction from '../../../controllers/api/v1/connections/test-connection.js';
import verifyConnectionAction from '../../../controllers/api/v1/connections/verify-connection.js';

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
  asyncHandler(testConnectionAction)
);

router.post(
  '/:connectionId/verify',
  authenticateUser,
  authorizeUser,
  asyncHandler(verifyConnectionAction)
);

export default router;
