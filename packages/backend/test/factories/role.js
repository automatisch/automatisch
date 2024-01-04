export const createRole = async (params = {}) => {
  params.name = params?.name || 'Viewer';
  params.key = params?.key || 'viewer';

  const [role] = await global.knex.table('roles').insert(params).returning('*');

  return role;
};
