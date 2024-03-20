import Role from '../../src/models/role';

export const createRole = async (params = {}) => {
  params.name = params?.name || 'Viewer';
  params.key = params?.key || 'viewer';

  const role = await Role.query().insertAndFetch(params);

  return role;
};
