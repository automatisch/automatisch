import { GraphQLString, GraphQLNonNull } from 'graphql';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import executeFlowType from '../types/execute-flow';
import Processor from '../../services/processor';
import processorQueue from '../../queues/processor';

type Params = {
  stepId: string;
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

  // TODO: Use this snippet to execute flows with the background job.
  // const data = processorQueue.add('processorJob', {
  //   flowId: flow.id,
  //   stepId: step.id,
  // });

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
