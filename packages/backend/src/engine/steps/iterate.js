import processTriggerStep from '@/engine/trigger/process.js';
import processActionStep from '@/engine/action/process.js';
import Engine from '@/engine/index.js';
import McpToolExecution from '@/models/mcp-tool-execution.ee.js';
import delayAsMilliseconds from '@/helpers/delay-as-milliseconds.js';

const iterateSteps = async ({
  flow,
  triggerStep,
  untilStep,
  actionSteps,
  testRun,
  triggeredByRequest,
  triggeredByMcp,
  initialDataItem,
  resumeStepId,
  resumeExecutionId,
  mcpToolId,
}) => {
  let executionId = resumeExecutionId;
  let mcpToolExecutionId;

  if (!resumeStepId && !resumeExecutionId) {
    const {
      executionId: newExecutionId,
      mcpToolExecutionId: newMcpToolExecutionId,
      executionStep,
    } = await processTriggerStep({
      flowId: flow.id,
      stepId: triggerStep.id,
      initialDataItem,
      triggeredByMcp,
      mcpToolId,
      testRun,
    });

    executionId = newExecutionId;
    mcpToolExecutionId = newMcpToolExecutionId;

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
      if (triggeredByMcp) {
        return {
          mcpError: `Flow \`${flow.name}\` execution failed by action step \`${actionStep.key}\`.`,
        };
      }

      continue;
    }

    if (actionStep.appKey === 'filter' && !executionStep.dataOut) {
      if (triggeredByRequest) {
        return { statusCode: 422 };
      }

      if (triggeredByMcp) {
        return {
          mcpError: `Flow \`${flow.name}\` execution stopped by filter step. The input data was filtered out and no further actions were executed.`,
        };
      }

      break;
    }

    const workSynchronously =
      (triggerStep.appKey === 'webhook' || triggerStep.appKey === 'forms') &&
      triggerStep.parameters.workSynchronously;

    if (
      !testRun &&
      actionStep.appKey === 'delay' &&
      !workSynchronously &&
      !triggeredByMcp
    ) {
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

  if (triggeredByMcp) {
    const execution = await flow
      .$relatedQuery('executions')
      .findById(executionId);

    const respondWithStep = await flow
      .$relatedQuery('steps')
      .where({ app_key: 'mcp', key: 'respondWith' })
      .first();

    const respondWithExecutionStep = await execution
      .$relatedQuery('executionSteps')
      .where({ step_id: respondWithStep.id })
      .first();

    const mcpToolExecution = await McpToolExecution.query()
      .where({
        id: mcpToolExecutionId,
      })
      .first();

    await mcpToolExecution
      .$query()
      .patchAndFetch({ dataOut: respondWithExecutionStep.dataOut });

    return {
      mcpSuccess: `Successfully executed flow \`${flow.name}\`.`,
      mcpData: respondWithExecutionStep.dataOut,
    };
  }

  if (triggeredByRequest) {
    return { statusCode: 204 };
  }
};

export default iterateSteps;
