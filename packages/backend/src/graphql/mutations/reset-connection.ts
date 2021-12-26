import { GraphQLInt, GraphQLNonNull } from 'graphql';
import Connection from '../../models/connection';
import connectionType from '../types/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: number
}

const resetConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let connection = await Connection.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  }).throwIfNotFound();

  connection = await connection.$query().patchAndFetch({
    data: { screenName: connection.data.screenName }
  })

  return connection;
}

const resetConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => resetConnectionResolver(params, req)
};

export default resetConnection;
