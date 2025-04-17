import { Router } from 'express';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getSamlAuthProvidersAction from '../../../../controllers/internal/api/v1/saml-auth-providers/get-saml-auth-providers.ee.js';

const router = Router();

router.get('/', checkIsEnterprise, getSamlAuthProvidersAction);

export default router;
