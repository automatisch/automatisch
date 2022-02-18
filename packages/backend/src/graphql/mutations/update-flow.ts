import { GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import flowType from '../types/flow';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';

type Params = {
  id: string;
  name: string;
  active: boolean;
};

const updateFlowResolver = async (
  params: Params,
  req: RequestWithCurrentUser
) => {
  let flow = await req.currentUser
    .$relatedQuery('flows')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  flow = await flow.$query().patchAndFetch({
    ...flow,
    ...params,
  });

  return flow;
};

const updateFlow = {
  type: flowType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    active: { type: GraphQLBoolean },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    updateFlowResolver(params, req),
};

export default updateFlow;
