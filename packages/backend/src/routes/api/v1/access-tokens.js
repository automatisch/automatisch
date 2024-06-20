import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import createAccessTokenAction from '../../../controllers/api/v1/access-tokens/create-access-token.js';
import revokeAccessTokenAction from '../../../controllers/api/v1/access-tokens/revoke-access-token.js';
import { authenticateUser } from '../../../helpers/authentication.js';
const router = Router();

router.post('/', asyncHandler(createAccessTokenAction));

router.delete(
  '/:token',
  authenticateUser,
  asyncHandler(revokeAccessTokenAction)
);

export default router;
