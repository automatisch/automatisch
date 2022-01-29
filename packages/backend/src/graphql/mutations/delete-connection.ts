import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string;
  data: object;
};
const deleteConnectionResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  await req.currentUser
    .$relatedQuery('connections')
    .delete()
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  return;
};

const deleteConnection = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    deleteConnectionResolver(params, req),
};

export default deleteConnection;
