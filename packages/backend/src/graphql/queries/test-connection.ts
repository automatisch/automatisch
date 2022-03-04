import { GraphQLString, GraphQLNonNull } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import connectionType from '../types/connection';
import App from '../../models/app';

type Params = {
  id: string;
  data: object;
};
const testConnectionResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  let connection = await req.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  const appClass = (await import(`../../apps/${connection.key}`)).default;
  const appData = App.findOneByKey(connection.key);

  const appInstance = new appClass(appData, connection.formattedData);
  const isStillVerified =
    await appInstance.authenticationClient.isStillVerified();

  connection = await connection.$query().patchAndFetch({
    formattedData: connection.formattedData,
    verified: isStillVerified,
  });

  return connection;
};

const testConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    testConnectionResolver(params, req),
};

export default testConnection;
