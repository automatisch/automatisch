import { GraphQLInt, GraphQLNonNull } from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import connectionType from '../types/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: number;
  data: object;
};
const updateConnectionResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  let connection = await req.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  connection = await connection.$query().patchAndFetch({
    data: {
      ...connection.data,
      ...params.data,
    },
  });

  return connection;
};

const updateConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    data: { type: GraphQLNonNull(GraphQLJSONObject) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    updateConnectionResolver(params, req),
};

export default updateConnection;
