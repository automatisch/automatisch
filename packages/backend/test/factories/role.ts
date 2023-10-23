import { IRole } from '@automatisch/types';

type RoleParams = {
  name?: string;
  key?: string;
};

export const createRole = async (params: RoleParams = {}): Promise<IRole> => {
  params.name = params?.name || 'Viewer';
  params.key = params?.key || 'viewer';

  const [role] = await knex.table('roles').insert(params).returning('*');

  return role;
};
