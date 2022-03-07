import Context from '../../types/express/context';
import Processor from '../../services/processor';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import processorQueue from '../../queues/processor';

type Params = {
  stepId: string;
};

const executeFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const step = await context.currentUser
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

export default executeFlow;
