import App from '../../models/app';
import Connection from '../../models/connection';
import globalVariable from '../../helpers/global-variable';

const testConnection = async (_parent, params, context) => {
  const conditions = context.currentUser.can('update', 'Connection');
  const userConnections = context.currentUser.$relatedQuery('connections');
  const allConnections = Connection.query();
  const connectionBaseQuery = conditions.isCreator
    ? userConnections
    : allConnections;

  let connection = await connectionBaseQuery
    .clone()
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  const app = await App.findOneByKey(connection.key, false);
  const $ = await globalVariable({ connection, app });

  let isStillVerified;
  try {
    isStillVerified = !!(await app.auth.isStillVerified($));
  } catch {
    isStillVerified = false;
  }

  connection = await connection.$query().patchAndFetch({
    formattedData: connection.formattedData,
    verified: isStillVerified,
  });

  return connection;
};

export default testConnection;
