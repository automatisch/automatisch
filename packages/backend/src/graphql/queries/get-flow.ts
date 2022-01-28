import { GraphQLNonNull, GraphQLInt } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import flowType from '../types/flow';

type Params = {
  id: number;
};

const getFlowResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const flow = await req.currentUser
    .$relatedQuery('flows')
    .withGraphJoined('[steps.[connection]]')
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': params.id })
    .throwIfNotFound();

  return flow;
};

const getFlow = {
  type: flowType,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    getFlowResolver(params, req),
};

export default getFlow;
