import { faker } from '@faker-js/faker';
import { createRole } from './role.js';
import RoleMapping from '../../src/models/role-mapping.ee.js';
import { createSamlAuthProvider } from './saml-auth-provider.ee.js';

export const createRoleMapping = async (params = {}) => {
  params.roleId = params.roleId || (await createRole()).id;
  params.samlAuthProviderId =
    params.samlAuthProviderId || (await createSamlAuthProvider()).id;
  params.remoteRoleName = params.remoteRoleName || faker.person.jobType();

  const roleMapping = await RoleMapping.query().insertAndFetch(params);

  return roleMapping;
};
