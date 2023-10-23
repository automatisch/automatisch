import { IPermission } from '@automatisch/types';
import { createRole } from './role';

type PermissionParams = {
  roleId?: string;
  action?: string;
  subject?: string;
};

export const createPermission = async (
  params: PermissionParams = {}
): Promise<IPermission> => {
  const permissionData = {
    roleId: params?.roleId || (await createRole()).id,
    action: params?.action || 'read',
    subject: params?.subject || 'User',
  };

  const [permission] = await global.knex
    .table('permissions')
    .insert(permissionData)
    .returning('*');

  return permission;
};
