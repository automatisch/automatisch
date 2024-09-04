import { faker } from '@faker-js/faker';
import Role from '../../src/models/role';

export const createRole = async (params = {}) => {
  const name = faker.lorem.word();

  params.name = params?.name || name;

  const role = await Role.query().insertAndFetch(params);

  return role;
};
