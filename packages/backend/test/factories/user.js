import { createRole } from './role';
import { faker } from '@faker-js/faker';
import User from '../../src/models/user';

export const createUser = async (params = {}) => {
  params.roleId = params?.roleId || (await createRole()).id;
  params.fullName = params?.fullName || faker.person.fullName();
  params.email = params?.email || faker.internet.email();
  params.password = params?.password || faker.internet.password();

  const user = await User.query().insertAndFetch(params);

  return user;
};
