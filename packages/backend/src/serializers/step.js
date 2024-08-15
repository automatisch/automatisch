import executionStepSerializer from './execution-step.js';

const stepSerializer = (step) => {
  let stepData = {
    id: step.id,
    type: step.type,
    key: step.key,
    appKey: step.appKey,
    iconUrl: step.iconUrl,
    webhookUrl: step.webhookUrl,
    status: step.status,
    position: step.position,
    parameters: step.parameters,
  };

  if (step.executionSteps?.length > 0) {
    stepData.executionSteps = step.executionSteps.map((executionStep) =>
      executionStepSerializer(executionStep)
    );
  }

  return stepData;
};

export default stepSerializer;
