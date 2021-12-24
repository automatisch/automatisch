import { GraphQLList, GraphQLString } from 'graphql';
import Flow from '../../models/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import flowType from '../types/flow';

const getFlowsResolver = async (req: RequestWithCurrentUser) => {
  const flows = await Flow.query()
    .withGraphJoined('[steps.[connection]]')
    .where({'flows.user_id': req.currentUser.id});

  return flows;
}

const getFlows = {
  type: GraphQLList(flowType),
  resolve: (_: any, _params: any, req: RequestWithCurrentUser) => getFlowsResolver(req)
}

export default getFlows;
