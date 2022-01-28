import { GraphQLList } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import flowType from '../types/flow';

const getFlowsResolver = async (
  req: RequestWithCurrentUser
): Promise<any[]> => {
  const flows = await req.currentUser
    .$relatedQuery('flows')
    .withGraphJoined('[steps.[connection]]');

  return flows;
};

const getFlows = {
  type: GraphQLList(flowType),
  resolve: (_: any, _params: any, req: RequestWithCurrentUser) =>
    getFlowsResolver(req),
};

export default getFlows;
