import { faker } from '@faker-js/faker';
import Role from '../../src/models/role.js';

export const createRole = async (params = {}) => {
  const name = faker.lorem.word();

  params.name = params?.name || name;

  const existingRole = await Role.query().findOne({ name }).first();

  if (existingRole) {
    return await createRole();
  }

  const role = await Role.query().insertAndFetch(params);

  return role;
};
