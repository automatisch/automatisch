import Step from '../models/step';
import { processFlow } from '../services/flow';
import { processTrigger } from '../services/trigger';
import { processAction } from '../services/action';

type TestRunOptions = {
  stepId: string;
};

const testRun = async (options: TestRunOptions) => {
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
