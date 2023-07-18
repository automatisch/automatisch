import Context from '../../types/express/context';
import Role from '../../models/role';

type Params = {
  id: string
};

// TODO: access
const getRole = async (_parent: unknown, params: Params, context: Context) => {
  return await Role.query().findById(params.id).throwIfNotFound();
};

export default getRole;
