import Context from '../../types/express/context';
import Connection from '../../models/connection';

type Params = {
  input: {
    id: string;
  };
};

const deleteConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('delete', 'Connection');
  const userConnections = context.currentUser.$relatedQuery('connections');
  const allConnections = Connection.query();
  const baseQuery = conditions.isCreator ? userConnections : allConnections;

  await baseQuery
    .clone()
    .delete()
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  return;
};

export default deleteConnection;
