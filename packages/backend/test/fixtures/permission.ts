import createRole from './role';

type PermissionParams = {
  roleId?: string;
  action?: string;
  subject?: string;
};

const createPermission = async (params: PermissionParams = {}) => {
  const permissionData = {
    role_id: params?.roleId || (await createRole()).id,
    action: params?.action || 'read',
    subject: params?.subject || 'User',
  };

  const [permission] = await global.knex
    .table('permissions')
    .insert(permissionData)
    .returning('*');

  return permission;
};

export default createPermission;
