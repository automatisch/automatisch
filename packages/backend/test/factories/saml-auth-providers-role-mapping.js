import { faker } from '@faker-js/faker';
import { createRole } from './role.js';
import SamlAuthProvidersRoleMapping from '../../src/models/saml-auth-providers-role-mapping.ee.js';
import { createSamlAuthProvider } from './saml-auth-provider.ee.js';

export const createSamlAuthProvidersRoleMapping = async (params = {}) => {
  params.roleId = params.roleId || (await createRole()).id;
  params.samlAuthProviderId =
    params.samlAuthProviderId || (await createSamlAuthProvider()).id;
  params.remoteRoleName = params.remoteRoleName || faker.person.jobType();

  const samlAuthProvider =
    await SamlAuthProvidersRoleMapping.query().insertAndFetch(params);

  return samlAuthProvider;
};
