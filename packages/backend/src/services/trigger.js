import Step from '../models/step.js';
import Flow from '../models/flow.js';
import Execution from '../models/execution.js';
import globalVariable from '../helpers/global-variable.js';

export const processTrigger = async (options) => {
  const { flowId, stepId, triggerItem, error, testRun } = options;

  const step = await Step.query().findById(stepId).throwIfNotFound();

  const $ = await globalVariable({
    flow: await Flow.query().findById(flowId).throwIfNotFound(),
    app: await step.getApp(),
    step: step,
    connection: await step.$relatedQuery('connection'),
  });

  // check if we already process this trigger data item or not!

  const execution = await Execution.query().insert({
    flowId: $.flow.id,
    testRun,
    internalId: triggerItem?.meta.internalId,
  });

  const executionStep = await execution
    .$relatedQuery('executionSteps')
    .insertAndFetch({
      stepId: $.step.id,
      status: error ? 'failure' : 'success',
      dataIn: $.step.parameters,
      dataOut: !error ? triggerItem?.raw : null,
      errorDetails: error,
    });

  return { flowId, stepId, executionId: execution.id, executionStep };
};
