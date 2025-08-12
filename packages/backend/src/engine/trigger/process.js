import buildTriggerStepContext from '@/engine/trigger/context.js';
import Execution from '@/models/execution.js';

const processTriggerStep = async ({
  stepId,
  initialDataItem,
  testRun = false,
}) => {
  // Build the trigger step context
  const { flow, step } = await buildTriggerStepContext({ stepId });

  // Create the execution for the trigger step
  const execution = await Execution.query().insert({
    flowId: flow.id,
    testRun,
    internalId: initialDataItem?.meta.internalId,
  });

  // Create the execution step for the trigger step
  const executionStep = await execution
    .$relatedQuery('executionSteps')
    .insertAndFetch({
      stepId,
      status: 'success',
      dataIn: step?.parameters,
      dataOut: initialDataItem?.raw,
      errorDetails: null,
    });

  return { flowId: flow.id, stepId, executionId: execution.id, executionStep };
};

export default processTriggerStep;
