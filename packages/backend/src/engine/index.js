import FlowValidator from '@/engine/flow-validator/index.js';
import WorkflowExecutor from '@/engine/workflow-executor/index.js';
import DataLoader from '@/engine/data-loader/index.js';
import flowQueue from '@/queues/flow.js';
import {
  REMOVE_AFTER_30_DAYS_OR_150_JOBS,
  REMOVE_AFTER_7_DAYS_OR_50_JOBS,
} from '@/helpers/remove-job-configuration.js';
import FlowContext from '@/engine/flow-context/index.js';

const run = async ({
  flowId,
  untilStepId,
  triggeredByRequest,
  request,
  testRun = false,
  resumeStepId, // eslint-disable-line no-unused-vars
  resumeExecutionId, // eslint-disable-line no-unused-vars
}) => {
  // Build flow context
  const flowContext = new FlowContext({ flowId });
  await flowContext.build();

  // Check if the flow is valid and can be executed
  const flowValidator = new FlowValidator(flowContext);
  const isValid = await flowValidator.run();
  if (!isValid) return;

  // TODO: Implement resume flow
  // if (resumeStepId && resumeExecutionId) {
  //   return await WorkflowExecutor.run({
  //     flow,
  //     triggerStep,
  //     untilStep,
  //     actionSteps,
  //     testRun,
  //     triggeredByRequest,
  //     initialDataItem: null,
  //     resumeStepId,
  //     resumeExecutionId,
  //   });
  // }

  // Ingest initial data from trigger and handle error and skip
  const dataLoader = new DataLoader(flowContext);
  const result = await dataLoader.run({
    request,
    triggeredByRequest,
  });
  if (result.error && testRun) return { executionStep: result.executionStep };
  if (result.error) return;
  if (result.skip) return;

  // Process each data item
  for (const initialDataItem of result.data) {
    const workflowExecutor = new WorkflowExecutor({
      flowContext,
      initialDataItem,
      triggeredByRequest,
    });

    const executorResult = await workflowExecutor.run();

    if (executorResult) {
      return executorResult;
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
