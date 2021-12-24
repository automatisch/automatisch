import { GraphQLNonNull, GraphQLString } from 'graphql';
import Flow from '../../models/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import flowType from '../types/flow';

type Params = {
  id: number
}

const getFlowResolver = async (params: Params, req: RequestWithCurrentUser) => {
  const flowParams = { user_id: req.currentUser.id, id: params.id }

  const flow = await Flow.query()
    .withGraphFetched('steps')
    .findOne(flowParams)
    .throwIfNotFound();

  return flow;
}

const getFlow = {
  type: flowType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => getFlowResolver(params, req)
}

export default getFlow;
