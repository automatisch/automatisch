import Step from '@/models/step.js';

const buildTriggerStepContext = async (options) => {
  const { stepId } = options;

  const step = await Step.query().findById(stepId);
  const flow = await step.$relatedQuery('flow');

  return {
    flow,
    step,
  };
};

export default buildTriggerStepContext;
