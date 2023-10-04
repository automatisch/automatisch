import createRole from './role';
import { faker } from '@faker-js/faker';

type UserParams = {
  roleId?: string;
  fullName?: string;
  email?: string;
  password?: string;
};

const createUser = async (params: UserParams = {}) => {
  const userData = {
    role_id: params?.roleId || (await createRole()).id,
    full_name: params?.fullName || faker.person.fullName(),
    email: params?.email || faker.internet.email(),
    password: params?.password || faker.internet.password(),
  };

  const [user] = await global.knex
    .table('users')
    .insert(userData)
    .returning('*');

  return user;
};

export default createUser;
