import Context from '../../types/express/context';
import Processor from '../../services/processor';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import processorQueue from '../../queues/processor';

type Params = {
  input: {
    stepId: string;
  };
};

const executeFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const untilStep = await context.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('connection')
    .findOne({
      'steps.id': params.input.stepId,
    })
    .throwIfNotFound();

  const flow = await untilStep.$relatedQuery('flow');

  const data = await new Processor(flow, {
    untilStep,
    testRun: true,
  }).run();

  await untilStep.$query().patch({
    status: 'completed',
  });

  return { data, step: untilStep };
};

export default executeFlow;
