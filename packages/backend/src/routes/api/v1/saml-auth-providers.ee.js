import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { checkIsEnterprise } from '../../../helpers/check-is-enterprise.js';
import getSamlAuthProvidersAction from '../../../controllers/api/v1/saml-auth-providers/get-saml-auth-providers.ee.js';

const router = Router();

router.get('/', checkIsEnterprise, asyncHandler(getSamlAuthProvidersAction));

export default router;
