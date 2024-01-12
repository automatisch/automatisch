import Step from '../models/step.js';
import { processFlow } from './flow.js';
import { processTrigger } from './trigger.js';
import { processAction } from './action.js';

const testRun = async (options) => {
  const untilStep = await Step.query()
    .findById(options.stepId)
    .throwIfNotFound();

  const flow = await untilStep.$relatedQuery('flow');
  const [triggerStep, ...actionSteps] = await flow
    .$relatedQuery('steps')
    .withGraphFetched('connection')
    .orderBy('position', 'asc');

  const { data, error: triggerError } = await processFlow({
    flowId: flow.id,
    testRun: true,
  });

  if (triggerError) {
    const { executionStep: triggerExecutionStepWithError } =
      await processTrigger({
        flowId: flow.id,
        stepId: triggerStep.id,
        error: triggerError,
        testRun: true,
      });

    return { executionStep: triggerExecutionStepWithError };
  }

  const firstTriggerItem = data[0];

  const { executionId, executionStep: triggerExecutionStep } =
    await processTrigger({
      flowId: flow.id,
      stepId: triggerStep.id,
      triggerItem: firstTriggerItem,
      testRun: true,
    });

  if (triggerStep.id === untilStep.id) {
    return { executionStep: triggerExecutionStep };
  }

  for (const actionStep of actionSteps) {
    const { executionStep: actionExecutionStep } = await processAction({
      flowId: flow.id,
      stepId: actionStep.id,
      executionId,
    });

    if (actionStep.id === untilStep.id || actionExecutionStep.isFailed) {
      return { executionStep: actionExecutionStep };
    }
  }
};

export default testRun;
