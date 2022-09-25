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
    .withGraphFetched('executionSteps')
    .modifyGraph('executionSteps', (builder) => {
      builder.orderBy('created_at', 'desc').limit(1);
    })
    .where('flow_id', '=', step.flowId)
    .andWhere('position', '<', step.position)
    .orderBy('steps.position', 'asc');

  return previousStepsWithCurrentStep;
};

export default getStepWithTestExecutions;
