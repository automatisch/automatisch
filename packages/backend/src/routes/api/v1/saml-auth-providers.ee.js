import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../helpers/check-is-enterprise.js';
import getSamlAuthProvidersAction from '../../../controllers/api/v1/saml-auth-providers/get-saml-auth-providers.ee.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeUser,
  checkIsEnterprise,
  getSamlAuthProvidersAction
);

export default router;
