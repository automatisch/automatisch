import processTriggerStep from '@/engine/trigger/process.js';
import processActionStep from '@/engine/action/process.js';
import Engine from '@/engine/index.js';
import delayAsMilliseconds from '@/helpers/delay-as-milliseconds.js';

const iterateSteps = async ({
  flow,
  triggerStep,
  untilStep,
  actionSteps,
  testRun,
  triggeredByRequest,
  initialDataItem,
  resumeStepId,
  resumeExecutionId,
}) => {
  let executionId = resumeExecutionId;

  if (!resumeStepId && !resumeExecutionId) {
    const { executionId: newExecutionId, executionStep } =
      await processTriggerStep({
        flowId: flow.id,
        stepId: triggerStep.id,
        initialDataItem,
        testRun,
      });

    executionId = newExecutionId;

    if (testRun && triggerStep.id === untilStep.id) {
      return { executionStep };
    }

    if (testRun && triggeredByRequest) {
      return { statusCode: 204 };
    }
  }

  const resumeStep = actionSteps.find((step) => step.id === resumeStepId);

  const stepsToProcess = resumeStep
    ? actionSteps.filter((step) => step.position >= resumeStep.position)
    : actionSteps;

  for (const actionStep of stepsToProcess) {
    // Process action step by saving execution and execution step data.
    const { executionStep, computedParameters } = await processActionStep({
      flow,
      stepId: actionStep.id,
      executionId,
    });

    if (testRun && (actionStep.id === untilStep.id || executionStep.isFailed)) {
      return { executionStep };
    }

    if (!testRun && executionStep.isFailed) {
      continue;
    }

    if (actionStep.appKey === 'filter' && !executionStep.dataOut) {
      if (triggeredByRequest) {
        return { statusCode: 422 };
      }

      break;
    }

    const workSynchronously =
      (triggerStep.appKey === 'webhook' || triggerStep.appKey === 'forms') &&
      triggerStep.parameters.workSynchronously;

    if (!testRun && actionStep.appKey === 'delay' && !workSynchronously) {
      const nextStepId = await actionStep.getNextStep();

      if (!nextStepId) {
        return;
      }

      await Engine.runInBackground({
        flowId: flow.id,
        resumeStepId: nextStepId.id,
        resumeExecutionId: executionId,
        delay: delayAsMilliseconds(actionStep.key, computedParameters),
      });

      return;
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

  if (triggeredByRequest) {
    return { statusCode: 204 };
  }
};

export default iterateSteps;
