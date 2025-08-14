import globalVariable from '@/engine/global-variable.js';
import Execution from '@/models/execution.js';

const processInitialDataError = async (options) => {
  const { error, testRun, flow, triggerStep, triggerApp, triggerConnection } =
    options;

  const $ = await globalVariable({
    flow,
    app: triggerApp,
    step: triggerStep,
    connection: triggerConnection,
  });

  const execution = await Execution.query().insert({
    flowId: flow.id,
    testRun,
  });

  const executionStep = await execution
    .$relatedQuery('executionSteps')
    .insertAndFetch({
      stepId: triggerStep.id,
      status: 'failure',
      dataIn: $.step.parameters,
      dataOut: null,
      errorDetails: error,
    });

  return {
    flowId: flow.id,
    stepId: triggerStep.id,
    executionId: execution.id,
    executionStep,
  };
};

export default processInitialDataError;
