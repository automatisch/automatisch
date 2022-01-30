import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string;
};

const deleteFlowResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  await req.currentUser
    .$relatedQuery('flows')
    .delete()
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  return;
};

const deleteFlow = {
  type: GraphQLBoolean,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    deleteFlowResolver(params, req),
};

export default deleteFlow;
