import { Router } from 'express';
import v1Router from './v1/index.ee.js';
import { checkIsEnterprise } from '../../helpers/check-is-enterprise.js';
import { authenticateApiToken } from '../../helpers/authenticate-api-token.ee.js';

const router = Router();

router.use('/v1', checkIsEnterprise, authenticateApiToken, v1Router);

export default router;
