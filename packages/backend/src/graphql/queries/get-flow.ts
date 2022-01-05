import { GraphQLNonNull, GraphQLInt } from 'graphql';
import Flow from '../../models/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import flowType from '../types/flow';

type Params = {
  id: number
}

const getFlowResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const flow = await Flow.query()
    .withGraphJoined('[steps.[connection]]')
    .findOne({'flows.user_id': req.currentUser.id, 'flows.id': params.id})
    .throwIfNotFound();

  return flow;
}

const getFlow = {
  type: flowType,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => getFlowResolver(params, req)
}

export default getFlow;
