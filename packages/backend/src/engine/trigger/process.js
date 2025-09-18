import buildTriggerStepContext from '@/engine/trigger/context.js';
import Execution from '@/models/execution.js';
import McpToolExecuton from '@/models/mcp-tool-execution.ee.js';

const processTriggerStep = async ({
  flowId,
  stepId,
  initialDataItem,
  triggeredByMcp,
  mcpToolId,
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

  if (triggeredByMcp && step?.appKey === 'mcp' && step?.key === 'mcpTool') {
    const mcpToolExecution = await McpToolExecuton.query().insert({
      mcpToolId,
      dataIn: initialDataItem?.raw,
      status: 'success',
    });

    return {
      executionId: execution.id,
      mcpToolExecutionId: mcpToolExecution.id,
      executionStep,
    };
  }

  return { executionId: execution.id, executionStep };
};

export default processTriggerStep;
