import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import Flow from '../../models/flow';
import flowType from '../types/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string,
  name: string
}
const updateFlowResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let flow = await Flow.query().findOne({
    user_id: req.currentUser.id,
    id: params.id
  }).throwIfNotFound();

  flow = await flow.$query().patchAndFetch({
    ...flow,
    ...params
  })

  return flow;
}

const updateFlow = {
  type: flowType,
  args: {
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => updateFlowResolver(params, req)
};

export default updateFlow;
