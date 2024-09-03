import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeAdmin } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import createSamlAuthProviderAction from '../../../../controllers/api/v1/admin/saml-auth-providers/create-saml-auth-provider.ee.js';
import updateSamlAuthProviderAction from '../../../../controllers/api/v1/admin/saml-auth-providers/update-saml-auth-provider.ee.js';
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

router.post(
  '/',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  createSamlAuthProviderAction
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

router.patch(
  '/:samlAuthProviderId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  updateSamlAuthProviderAction
);

export default router;
