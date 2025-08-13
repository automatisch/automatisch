import buildFlowContext from '@/engine/flow/context.js';
import getInitialData from '@/engine/initial-data/get.js';
import processInitialDataError from '@/engine/initial-data/process-error.js';
import processTriggerStep from '@/engine/trigger/process.js';
import processActionStep from '@/engine/action/process.js';
import checkLimits from '@/engine/cloud/check-limits.js';

const run = async ({ flowId, untilStepId, testRun = false }) => {
  // Build flow context
  const {
    flow,
    untilStep,
    triggerStep,
    triggerConnection,
    triggerApp,
    triggerCommand,
    actionSteps,
  } = await buildFlowContext({
    flowId,
    untilStepId,
  });

  // Check if the user is allowed to run the flow in cloud when it's not a test run
  const { isAllowedToRunFlows } = await checkLimits({ flow });
  if (!testRun && !isAllowedToRunFlows) return;

  // Get initial flow data to start the flow
  const { data, error } = await getInitialData({
    testRun,
    flow,
    triggerStep,
    triggerConnection,
    triggerApp,
    triggerCommand,
  });

  // Process initial data error
  // TODO: Make this also works with a background job.
  if (error) {
    const { executionStep } = await processInitialDataError({
      error,
      testRun,
      flow,
      triggerStep,
      triggerApp,
      triggerConnection,
    });

    if (testRun) {
      return { executionStep };
    }

    return;
  }

  const firstInitialDataItem = data[0];
  const reversedInitialData = testRun ? [firstInitialDataItem] : data.reverse();

  for (const initialDataItem of reversedInitialData) {
    // Process trigger step by saving execution and execution step data.
    const { executionId, executionStep } = await processTriggerStep({
      flowId: flow.id,
      stepId: triggerStep.id,
      initialDataItem,
      testRun,
    });

    if (testRun && triggerStep.id === untilStep.id) {
      return { executionStep };
    }

    for (const actionStep of actionSteps) {
      // Process action step by saving execution and execution step data.
      const { executionStep } = await processActionStep({
        flow,
        stepId: actionStep.id,
        executionId,
      });

      if (
        testRun &&
        (actionStep.id === untilStep.id || executionStep.isFailed)
      ) {
        return { executionStep };
      }

      if (!testRun && executionStep.isFailed) {
        continue;
      }
    }
  }
};

const runInBackground = async (options) => {
  return await run(options);
};

const Engine = {
  run,
  runInBackground,
};

export default Engine;
