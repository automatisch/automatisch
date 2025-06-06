import { faker } from '@faker-js/faker';
import { createRole } from '@/factories/role.js';
import RoleMapping from '@/models/role-mapping.ee.js';
import { createSamlAuthProvider } from '@/factories/saml-auth-provider.ee.js';

export const createRoleMapping = async (params = {}) => {
  params.roleId = params.roleId || (await createRole()).id;
  params.samlAuthProviderId =
    params.samlAuthProviderId || (await createSamlAuthProvider()).id;
  params.remoteRoleName = params.remoteRoleName || faker.person.jobType();

  const roleMapping = await RoleMapping.query().insertAndFetch(params);

  return roleMapping;
};
