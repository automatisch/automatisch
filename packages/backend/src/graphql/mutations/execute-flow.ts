import { GraphQLString, GraphQLNonNull } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import executeFlowType from '../types/execute-flow';
import Processor from '../../services/processor';

type Params = {
  stepId: string;
  data: Record<string, unknown>;
};
const executeFlowResolver = async (
  params: Params,
  req: RequestWithCurrentUser
): Promise<any> => {
  const step = await req.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('connection')
    .findOne({
      'steps.id': params.stepId,
    })
    .throwIfNotFound();

  const flow = await step.$relatedQuery('flow');
  const data = await new Processor(flow, step).run();

  await step.$query().patch({
    status: 'completed',
  });

  return { data, step };
};

const executeFlow = {
  type: executeFlowType,
  args: {
    stepId: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) =>
    executeFlowResolver(params, req),
};

export default executeFlow;
