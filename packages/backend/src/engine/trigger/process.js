import buildTriggerStepContext from '@/engine/trigger/context.js';
import Execution from '@/models/execution.js';

const processTriggerStep = async ({
  flowId,
  stepId,
  initialDataItem,
  testRun = false,
}) => {
  // Build the trigger step context
  const { step } = await buildTriggerStepContext({ stepId });

  // Create the execution for the trigger step
  const execution = await Execution.query().insert({
    flowId,
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

  return { executionId: execution.id, executionStep };
};

export default processTriggerStep;
