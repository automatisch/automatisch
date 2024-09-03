import { faker } from '@faker-js/faker';
import Role from '../../src/models/role';

export const createRole = async (params = {}) => {
  const name = faker.lorem.word();
  const key = name.toLowerCase();

  params.name = params?.name || name;
  params.key = params?.key || key;

  const role = await Role.query().insertAndFetch(params);

  return role;
};
