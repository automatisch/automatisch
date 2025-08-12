import Step from '@/models/step.js';

const buildFlowContext = async (options) => {
  const { untilStepId } = options;

  const untilStep = await Step.query().findById(untilStepId).throwIfNotFound();
  const flow = await untilStep.$relatedQuery('flow').throwIfNotFound();

  const triggerStep = await flow.getTriggerStep();
  const triggerConnection = await triggerStep.$relatedQuery('connection');
  const triggerApp = await triggerStep.getApp();
  const triggerCommand = await triggerStep.getTriggerCommand();

  const actionSteps = await flow.getActionSteps();

  return {
    flow,
    untilStep,
    triggerStep,
    triggerConnection,
    triggerApp,
    triggerCommand,
    actionSteps,
  };
};

export default buildFlowContext;
