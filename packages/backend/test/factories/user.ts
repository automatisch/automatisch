import { createRole } from './role';
import { faker } from '@faker-js/faker';
import User from '../../src/models/user';

export const createUser = async (params: Partial<User> = {}) => {
  params.roleId = params?.roleId || (await createRole()).id;
  params.fullName = params?.fullName || faker.person.fullName();
  params.email = params?.email || faker.internet.email();
  params.password = params?.password || faker.internet.password();

  const [user] = await global.knex.table('users').insert(params).returning('*');

  return user;
};
