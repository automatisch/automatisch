import Context from '../../types/express/context';
import Role from '../../models/role';

// TODO: access
const getRoles = async (_parent: unknown, params: unknown, context: Context) => {
  return await Role.query();
};

export default getRoles;
