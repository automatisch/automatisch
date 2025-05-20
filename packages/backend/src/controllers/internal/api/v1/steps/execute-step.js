import { processAction } from '../../../../../services/action.js';
import { processTrigger } from '../../../../../services/trigger.js';

export default async (request, response) => {
  const step = await request.currentUser.authorizedSteps
    .findById(request.params.stepId)
    .throwIfNotFound();

  const flow = await step.$relatedQuery('flow');

  let executionStep;

  if (step.isTrigger) {
    const { executionStep: triggerExecutionStep } = await processTrigger({
      flowId: flow.id,
      stepId: step.id,
      testRun: true,
    });
    executionStep = triggerExecutionStep;
  } else {
    const { executionStep: actionExecutionStep } = await processAction({
      flowId: flow.id,
      stepId: step.id,
      testRun: true,
    });
    executionStep = actionExecutionStep;
  }

  response.json({
    data: executionStep.dataOut,
    step: {
      id: step.id,
      status: executionStep.status,
    },
  });
};
