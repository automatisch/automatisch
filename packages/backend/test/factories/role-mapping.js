import { createRole } from './role.js';
import { createSamlAuthProvider } from './saml-auth-provider.ee.js';
import SamlAuthProviderRoleMapping from '../../src/models/saml-auth-providers-role-mapping.ee.js';

export const createRoleMapping = async (params = {}) => {
  params.roleId = params?.roleId || (await createRole()).id;
  params.samlAuthProviderId =
    params?.samlAuthProviderId || (await createSamlAuthProvider()).id;

  params.remoteRoleName = params?.remoteRoleName || 'User';

  const samlAuthProviderRoleMapping =
    await SamlAuthProviderRoleMapping.query().insertAndFetch(params);

  return samlAuthProviderRoleMapping;
};
