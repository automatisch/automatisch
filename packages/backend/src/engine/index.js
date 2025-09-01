import isEmpty from 'lodash/isEmpty.js';
import buildFlowContext from '@/engine/flow/context.js';
import getInitialData from '@/engine/initial-data/get.js';
import processInitialDataError from '@/engine/initial-data/process-error.js';
import checkLimits from '@/engine/cloud/check-limits.js';
import iterateSteps from '@/engine/steps/iterate.js';
import flowQueue from '@/queues/flow.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '@/helpers/remove-job-configuration.js';

const run = async ({
  flowId,
  untilStepId,
  triggeredByRequest,
  request,
  testRun = false,
  resumeStepId,
  resumeExecutionId,
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

  if (resumeStepId && resumeExecutionId) {
    return await iterateSteps({
      flow,
      triggerStep,
      untilStep,
      actionSteps,
      testRun,
      triggeredByRequest,
      initialDataItem: null,
      resumeStepId,
      resumeExecutionId,
    });
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
    const result = await iterateSteps({
      flow,
      triggerStep,
      untilStep,
      actionSteps,
      testRun,
      triggeredByRequest,
      initialDataItem,
    });

    if (result) {
      return result;
    }
  }
};

const runInBackground = async (options) => {
  const {
    flowId,
    jobId,
    resumeStepId,
    resumeExecutionId,
    delay,
    repeat,
    request,
    testRun,
    triggeredByRequest,
  } = options;

  let jobName = 'execute-flow';

  if (resumeStepId && resumeExecutionId) {
    jobName = `resume-flow`;
  }

  await flowQueue.add(
    jobName,
    {
      flowId,
      request,
      resumeStepId,
      resumeExecutionId,
      testRun,
      triggeredByRequest,
    },
    {
      jobId,
      repeat,
      delay,
      removeOnComplete: REMOVE_AFTER_7_DAYS_OR_50_JOBS,
      removeOnFail: REMOVE_AFTER_30_DAYS_OR_150_JOBS,
    }
  );
};

const Engine = {
  run,
  runInBackground,
};

export default Engine;
