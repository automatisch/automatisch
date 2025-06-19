import Context from '../../types/express/context';
import ExecutionStep from '../../models/execution-step';
import { ref } from 'objection';

type Params = {
  stepId: string;
};

const getStepWithTestExecutions = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'Flow');

  const step = await context.currentUser
    .$relatedQuery('steps')
    .findOne({ 'steps.id': params.stepId })
    .throwIfNotFound();

  const previousStepsWithCurrentStep = await context.currentUser
    .$relatedQuery('steps')
    .withGraphJoined('executionSteps')
    .where('flow_id', '=', step.flowId)
    .andWhere('position', '<', step.position)
    .andWhere(
      'executionSteps.created_at',
      '=',
      ExecutionStep.query()
        .max('created_at')
        .where('step_id', '=', ref('steps.id'))
        .andWhere('status', 'success')
    )
    .orderBy('steps.position', 'asc');

  return previousStepsWithCurrentStep;
};

export default getStepWithTestExecutions;
