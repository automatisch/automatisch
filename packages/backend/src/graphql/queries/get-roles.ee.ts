import Context from '../../types/express/context';
import Role from '../../models/role';

const getRoles = async (_parent: unknown, params: unknown, context: Context) => {
  context.currentUser.can('read', 'Role');

  return await Role.query().orderBy('name');
};

export default getRoles;
