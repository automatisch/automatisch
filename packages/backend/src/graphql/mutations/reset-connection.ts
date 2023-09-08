import Context from '../../types/express/context';
import Connection from '../../models/connection';

type Params = {
  input: {
    id: string;
  };
};

const resetConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('update', 'Connection');
  const userConnections = context.currentUser.$relatedQuery('connections');
  const allConnections = Connection.query();
  const baseQuery = conditions.isCreator ? userConnections : allConnections;

  let connection = await baseQuery
    .clone()
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  if (!connection.formattedData) {
    return null;
  }

  connection = await connection.$query().patchAndFetch({
    formattedData: { screenName: connection.formattedData.screenName },
  });

  return connection;
};

export default resetConnection;
