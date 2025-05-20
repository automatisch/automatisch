import cors from 'cors';
import { Router } from 'express';
import { authenticateApiToken } from '../../helpers/authenticate-api-token.ee.js';
import { checkIsEnterprise } from '../../helpers/check-is-enterprise.js';
import renderOpenApiJson from '../../helpers/render-openapi-json.ee.js';
import v1Router from './v1/index.ee.js';

const router = Router();

router.use('/v1', checkIsEnterprise, authenticateApiToken, v1Router);
router.get('/openapi.json', cors({ origin: '*' }), renderOpenApiJson);

export default router;
