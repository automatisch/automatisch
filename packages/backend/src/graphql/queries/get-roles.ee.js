import Role from '../../models/role';

const getRoles = async (_parent, params, context) => {
  context.currentUser.can('read', 'Role');

  return await Role.query().orderBy('name');
};

export default getRoles;
