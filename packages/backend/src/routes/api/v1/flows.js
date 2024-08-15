import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getFlowsAction from '../../../controllers/api/v1/flows/get-flows.js';
import getFlowAction from '../../../controllers/api/v1/flows/get-flow.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, asyncHandler(getFlowsAction));

router.get(
  '/:flowId',
  authenticateUser,
  authorizeUser,
  asyncHandler(getFlowAction)
);

export default router;
