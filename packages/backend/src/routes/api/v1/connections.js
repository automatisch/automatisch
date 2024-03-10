import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getFlowsAction from '../../../controllers/api/v1/connections/get-flows.js';

const router = Router();

router.get(
  '/:connectionId/flows',
  authenticateUser,
  authorizeUser,
  asyncHandler(getFlowsAction)
);

export default router;
