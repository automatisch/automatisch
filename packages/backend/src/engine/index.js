import isEmpty from 'lodash/isEmpty.js';
import buildFlowContext from '@/engine/flow/context.js';
import getInitialData from '@/engine/initial-data/get.js';
import processInitialDataError from '@/engine/initial-data/process-error.js';
import processTriggerStep from '@/engine/trigger/process.js';
import processActionStep from '@/engine/action/process.js';
import checkLimits from '@/engine/cloud/check-limits.js';

const run = async ({
  flowId,
  untilStepId,
  triggeredByRequest,
  request,
  testRun = false,
}) => {
  // Build flow context
  const {
    flow,
    untilStep,
    triggerStep,
    triggerConnection,
    triggerApp,
    triggerCommand,
    actionSteps,
    isBuiltInApp,
  } = await buildFlowContext({
    flowId,
    untilStepId,
  });

  // Check if the user is allowed to run the flow in cloud when it's not a test run
  const { isAllowedToRunFlows } = await checkLimits({ flow });

  if (!testRun && !isAllowedToRunFlows) {
    return;
  }

  // Get initial flow data to start the flow
  const { data, error } = await getInitialData({
    testRun,
    flow,
    triggerStep,
    triggerConnection,
    triggerApp,
    triggerCommand,
    request,
    triggeredByRequest,
    isBuiltInApp,
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

  if (!isBuiltInApp && triggeredByRequest && isEmpty(reversedInitialData)) {
    return;
  }

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

    if (testRun && triggeredByRequest) {
      return { statusCode: 204 };
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

      if (actionStep.appKey === 'filter' && !executionStep.dataOut) {
        if (triggeredByRequest) {
          return { statusCode: 422 };
        }

        continue;
      }

      if (
        triggeredByRequest &&
        (actionStep.key === 'respondWith' ||
          actionStep.key === 'respondWithVoiceXml')
      ) {
        const { headers, statusCode, body } = executionStep.dataOut;

        return {
          statusCode,
          body,
          headers,
        };
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
