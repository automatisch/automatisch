import { GraphQLString, GraphQLNonNull } from 'graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import connectionType from '../types/connection';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import { IJSONObject } from '@automatisch/types';

type Params = {
  id: string;
  formattedData: IJSONObject;
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
    formattedData: {
      ...connection.formattedData,
      ...params.formattedData,
    },
  });

  return connection;
};

const updateConnection = {
  type: connectionType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    data: { type: GraphQLNonNull(GraphQLJSONObject) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    updateConnectionResolver(params, req),
};

export default updateConnection;
