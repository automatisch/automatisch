import { faker } from '@faker-js/faker';
import Role from '../../src/models/role';
import { createPermission } from './permission';

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

export const createAdminRole = async (params = {}) => {
  const adminRole = await createRole({ ...params, name: 'Admin' });

  await createPermission({
    roleId: adminRole.id,
    action: 'read',
    subject: 'Flow',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'create',
    subject: 'Flow',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'update',
    subject: 'Flow',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'delete',
    subject: 'Flow',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'publish',
    subject: 'Flow',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'read',
    subject: 'Connection',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'create',
    subject: 'Connection',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'update',
    subject: 'Connection',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'delete',
    subject: 'Connection',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'read',
    subject: 'Execution',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'create',
    subject: 'Execution',
  });

  await createPermission({
    roleId: adminRole.id,
    action: 'update',
    subject: 'Execution',
  });

  return adminRole;
};
