import { GraphQLString, GraphQLNonNull } from 'graphql';
import Connection from '../../models/connection';
import connectionType from '../types/connection';
import twitterCredentialInputType from '../types/twitter-credential-input';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string,
  data: object
}
const updateConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let connection = await Connection.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  })

  connection = await connection.$query().patchAndFetch({
    data: {
      ...connection.data,
      ...params.data
    }
  })

  // Not every updateConnection mutation can verify credentials as some need to reconnect
  try {
    const appClass = (await import(`../../apps/${connection.key}`)).default;

    const appInstance = new appClass(connection.data)
    const verifiedCredentials = await appInstance.verifyCredentials();

    connection = await connection.$query().patchAndFetch({
      data: verifiedCredentials
    })
  } catch {}

  return connection;
}

const updateConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(twitterCredentialInputType) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => updateConnectionResolver(params, req)
};

export default updateConnection;
