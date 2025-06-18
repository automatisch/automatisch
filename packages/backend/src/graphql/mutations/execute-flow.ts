import Context from '../../types/express/context';
import testRun from '../../services/test-run';

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
  context.currentUser.can('update', 'Flow');

  const { stepId } = params.input;

  const untilStep = await context.currentUser
    .$relatedQuery('steps')
    .findById(stepId)
    .throwIfNotFound();

  const { executionStep } = await testRun({ stepId });

  if (executionStep.isFailed) {
    throw new Error(JSON.stringify(executionStep.errorDetails));
  }

  await untilStep.$query().patch({
    status: 'completed',
  });

  return { data: executionStep.dataOut, step: untilStep };
};

export default executeFlow;
