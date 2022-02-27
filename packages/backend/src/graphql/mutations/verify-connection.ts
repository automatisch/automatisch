import { GraphQLString, GraphQLNonNull } from 'graphql';
import connectionType from '../types/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import App from '../../models/app';

type Params = {
  id: string;
};

const verifyConnectionResolver = async (
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

  const appInstance = new appClass(appData, connection.data);
  const verifiedCredentials =
    await appInstance.authenticationClient.verifyCredentials();

  connection = await connection.$query().patchAndFetch({
    data: {
      ...connection.data,
      ...verifiedCredentials,
    },
    verified: true,
  });

  return connection;
};

const verifyConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    verifyConnectionResolver(params, req),
};

export default verifyConnection;
