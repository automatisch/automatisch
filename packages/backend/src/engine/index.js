import buildFlowContext from '@/engine/flow-context/index.js';
import getInitialData from '@/engine/initial-data/get.js';
import processInitialDataError from '@/engine/initial-data/process-error.js';
import processTriggerStep from '@/engine/trigger/process.js';
import processActionStep from '@/engine/action/process.js';

const run = async (untilStepId, testRun = false) => {
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
    untilStepId,
  });

  // TODO: Check if the user is allowed to run the flow in cloud when it's not a test run

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
      stepId: triggerStep.id,
      initialDataItem,
      testRun,
    });

    if (testRun && triggerStep.id === untilStep.id) {
      return { executionStep };
    }

    for (const actionStep of actionSteps) {
      const { executionStep } = await processActionStep({
        flowId: flow.id,
        stepId: actionStep.id,
        executionId,
      });

      if (actionStep.id === untilStep.id || executionStep.isFailed) {
        return { executionStep };
      }
    }

    // Run action step
    // Save action step execution step data.
  }

  // Iterate the data and push it to the trigger
  // Push iterated data to actions

  // TODO: Introduce run in the background job everywhere.

  // const {
  //   flow,
  //   untilStep,
  //   triggerStep,
  //   triggerCommand,
  //   triggerApp,
  //   triggerConnection,
  //   actionSteps,
  //   execution,
  // } = context;

  // // Build global variable
  // const $ = await buildGlobalVariable({
  //   flow,
  //   connection: triggerConnection,
  //   app: triggerApp,
  //   step: triggerStep,
  //   testAndContinueButtonRun: true,
  // });

  // Run the step command

  // Handle errors

  // Create execution

  // Create execution step

  // Move to next step
};

const Engine = {
  run,
};

export default Engine;
