import Context from '../../types/express/context';
import Connection from '../../models/connection';

type Params = {
  id: string;
};

const getSharedConnectionRoleIds = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('update', 'Connection');

  if (conditions.isCreator) return;

  const connection = await Connection
    .query()
    .findById(params.id)
    .throwIfNotFound();

  const sharedConnections = await connection.$relatedQuery('sharedConnections');

  const roleIds = sharedConnections.map(({ roleId }) => roleId);

  return roleIds;
};

export default getSharedConnectionRoleIds;
