import { createRole } from './role';

export const createPermission = async (params = {}) => {
  params.roleId = params?.roleId || (await createRole()).id;
  params.action = params?.action || 'read';
  params.subject = params?.subject || 'User';
  params.conditions = params?.conditions || ['isCreator'];

  const [permission] = await global.knex
    .table('permissions')
    .insert(params)
    .returning('*');

  return permission;
};
