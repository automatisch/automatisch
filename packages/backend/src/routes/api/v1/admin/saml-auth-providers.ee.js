import { Router } from 'express';
import asyncHandler from 'express-async-handler';
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
  asyncHandler(getSamlAuthProvidersAction)
);

router.get(
  '/:samlAuthProviderId',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getSamlAuthProviderAction)
);

router.get(
  '/:samlAuthProviderId/role-mappings',
  authenticateUser,
  authorizeAdmin,
  checkIsEnterprise,
  asyncHandler(getRoleMappingsAction)
);

export default router;
