import Step from '@/models/step.js';
import Flow from '@/models/flow.js';

const buildFlowContext = async (options) => {
  const { flowId, untilStepId } = options;

  let flow, untilStep;

  if (untilStepId) {
    untilStep = await Step.query().findById(untilStepId);
    flow = await untilStep.$relatedQuery('flow').throwIfNotFound();
  } else {
    flow = await Flow.query().findById(flowId).throwIfNotFound();
    untilStep = await flow.getLastActionStep();
  }

  const triggerStep = await flow.getTriggerStep();
  const triggerConnection = await triggerStep.$relatedQuery('connection');
  const triggerApp = await triggerStep.getApp();
  const triggerCommand = await triggerStep.getTriggerCommand();

  const isBuiltInWebhookApp = triggerApp.key === 'webhook';
  const isBuiltInFormsApp = triggerApp.key === 'forms';
  const isBuiltInApp = isBuiltInWebhookApp || isBuiltInFormsApp;

  const actionSteps = await flow.getActionSteps();

  return {
    flow,
    untilStep,
    triggerStep,
    triggerConnection,
    triggerApp,
    triggerCommand,
    actionSteps,
    isBuiltInApp,
  };
};

export default buildFlowContext;
