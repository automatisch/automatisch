import Permission from '@/models/permission.js';
import { createRole } from '@/factories/role.js';

export const createPermission = async (params = {}) => {
  params.roleId = params?.roleId || (await createRole()).id;
  params.action = params?.action || 'read';
  params.subject = params?.subject || 'User';
  params.conditions = params?.conditions || ['isCreator'];

  const permission = await Permission.query().insertAndFetch(params);

  return permission;
};
