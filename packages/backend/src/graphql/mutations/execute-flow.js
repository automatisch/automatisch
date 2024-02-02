import testRun from '../../services/test-run.js';
import Step from '../../models/step.js';

const executeFlow = async (_parent, params, context) => {
  const conditions = context.currentUser.can('update', 'Flow');
  const isCreator = conditions.isCreator;
  const allSteps = Step.query();
  const userSteps = context.currentUser.$relatedQuery('steps');
  const baseQuery = isCreator ? userSteps : allSteps;

  const { stepId } = params.input;

  const untilStep = await baseQuery.clone().findById(stepId).throwIfNotFound();

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
