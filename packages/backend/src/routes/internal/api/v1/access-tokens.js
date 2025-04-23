import { Router } from 'express';
import createAccessTokenAction from '../../../../controllers/internal/api/v1/access-tokens/create-access-token.js';
import revokeAccessTokenAction from '../../../../controllers/internal/api/v1/access-tokens/revoke-access-token.js';
import { authenticateUser } from '../../../../helpers/authentication.js';
const router = Router();

router.post('/', createAccessTokenAction);

router.delete('/:token', authenticateUser, revokeAccessTokenAction);

export default router;
