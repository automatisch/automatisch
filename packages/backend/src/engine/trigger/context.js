import Step from '@/models/step.js';

const buildTriggerStepContext = async (options) => {
  const { stepId } = options;

  const step = await Step.query().findById(stepId).throwIfNotFound();

  return {
    step,
  };
};

export default buildTriggerStepContext;
