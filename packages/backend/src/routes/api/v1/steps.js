import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import getConnectionAction from '../../../controllers/api/v1/steps/get-connection.js';
import getPreviousStepsAction from '../../../controllers/api/v1/steps/get-previous-steps.js';
import createDynamicFieldsAction from '../../../controllers/api/v1/steps/create-dynamic-fields.js';
import createDynamicDataAction from '../../../controllers/api/v1/steps/create-dynamic-data.js';

const router = Router();

router.get(
  '/:stepId/connection',
  authenticateUser,
  authorizeUser,
  asyncHandler(getConnectionAction)
);

router.get(
  '/:stepId/previous-steps',
  authenticateUser,
  authorizeUser,
  asyncHandler(getPreviousStepsAction)
);

router.post(
  '/:stepId/dynamic-fields',
  authenticateUser,
  authorizeUser,
  asyncHandler(createDynamicFieldsAction)
);

router.post(
  '/:stepId/dynamic-data',
  authenticateUser,
  authorizeUser,
  asyncHandler(createDynamicDataAction)
);

export default router;
