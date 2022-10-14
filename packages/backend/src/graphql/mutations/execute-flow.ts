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
  const { stepId } = params.input;
  const { executionStep } = await testRun({ stepId });

  const untilStep = await context.currentUser
    .$relatedQuery('steps')
    .findById(stepId);

  await untilStep.$query().patch({
    status: 'completed',
  });

  if (executionStep.errorDetails) {
    throw new Error(JSON.stringify(executionStep.errorDetails));
  }

  return { data: executionStep.dataOut, step: untilStep };
};

export default executeFlow;
