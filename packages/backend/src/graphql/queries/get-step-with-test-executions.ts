import Context from '../../types/express/context';

type Params = {
  stepId: string;
};

const getStepWithTestExecutions = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const step = await context.currentUser
    .$relatedQuery('steps')
    .findOne({ 'steps.id': params.stepId })
    .throwIfNotFound();

  const previousStepsWithCurrentStep = await context.currentUser
    .$relatedQuery('steps')
    .withGraphJoined('executionSteps')
    .where('flow_id', '=', step.flowId)
    .andWhere('position', '<', step.position)
    .distinctOn('executionSteps.step_id')
    .orderBy([
      'executionSteps.step_id',
      { column: 'executionSteps.created_at', order: 'desc' },
    ]);

  return previousStepsWithCurrentStep;
};

export default getStepWithTestExecutions;
