import { GraphQLString, GraphQLNonNull } from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import Connection from '../../models/connection';
import connectionType from '../types/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string,
  data: object
}
const updateConnectionResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let connection = await Connection.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  });

  connection = await connection.$query().patchAndFetch({
    data: {
      ...connection.data,
      ...params.data
    }
  })

  return connection;
}

const updateConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLJSONObject) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => updateConnectionResolver(params, req)
};

export default updateConnection;
