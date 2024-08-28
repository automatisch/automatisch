import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getSamlAuthProvidersAction from '../../../../controllers/api/v1/admin/saml-auth-providers/get-saml-auth-providers.ee.js';
import getSamlAuthProviderAction from '../../../../controllers/api/v1/admin/saml-auth-providers/get-saml-auth-provider.ee.js';
import getRoleMappingsAction from '../../../../controllers/api/v1/admin/saml-auth-providers/get-role-mappings.ee.js';

const router = Router();

router.get(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getSamlAuthProvidersAction
);

router.get(
  '/:samlAuthProviderId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getSamlAuthProviderAction
);

router.get(
  '/:samlAuthProviderId/role-mappings',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  getRoleMappingsAction
);

export default router;
