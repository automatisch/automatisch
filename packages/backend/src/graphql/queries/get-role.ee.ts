import Context from '../../types/express/context';
import Role from '../../models/role';

type Params = {
  id: string
};

const getRole = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('read', 'Role');

  return await Role
    .query()
    .leftJoinRelated({
      permissions: true
    })
    .withGraphFetched({
      permissions: true
    })
    .findById(params.id)
    .throwIfNotFound();
};

export default getRole;
