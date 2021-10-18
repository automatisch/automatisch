import { GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import Connection from '../../models/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import connectionType from '../types/connection';

type Params = {
  key: string
}

const getAppConnectionsResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const connections = await Connection.query()
    .where({ user_id: req.currentUser.id, verified: true, key: params.key })

  return connections;
}

const getAppConnections = {
  type: GraphQLList(connectionType),
  args: {
    key: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => getAppConnectionsResolver(params, req)
}

export default getAppConnections;
