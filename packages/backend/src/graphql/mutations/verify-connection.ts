import { GraphQLInt, GraphQLNonNull } from 'graphql';
import Connection from '../../models/connection';
import connectionType from '../types/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: number
}
const verifyConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let connection = await Connection.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  }).throwIfNotFound();

  const appClass = (await import(`../../apps/${connection.key}`)).default;

  const appInstance = new appClass(connection.data)
  const verifiedCredentials = await appInstance.authenticationClient.verifyCredentials();

  connection = await connection.$query().patchAndFetch({
    data: {
      ...connection.data,
      ...verifiedCredentials
    },
    verified: true
  })

  return connection;
}

const verifyConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => verifyConnectionResolver(params, req)
};

export default verifyConnection;
