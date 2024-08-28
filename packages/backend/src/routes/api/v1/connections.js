import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getFlowsAction from '../../../controllers/api/v1/connections/get-flows.js';
import testConnectionAction from '../../../controllers/api/v1/connections/test-connection.js';
import verifyConnectionAction from '../../../controllers/api/v1/connections/verify-connection.js';
import deleteConnectionAction from '../../../controllers/api/v1/connections/delete-connection.js';

const router = Router();

router.delete(
  '/:connectionId',
  authenticateUser,
  authorizeUser,
  deleteConnectionAction
);

router.get(
  '/:connectionId/flows',
  authenticateUser,
  authorizeUser,
  getFlowsAction
);

router.post(
  '/:connectionId/test',
  authenticateUser,
  authorizeUser,
  testConnectionAction
);

router.post(
  '/:connectionId/verify',
  authenticateUser,
  authorizeUser,
  verifyConnectionAction
);

export default router;
