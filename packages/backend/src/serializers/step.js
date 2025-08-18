import executionStepSerializer from '@/serializers/execution-step.js';

const stepSerializer = (step) => {
  let stepData = {
    id: step.id,
    type: step.type,
    key: step.key,
    name: step.name,
    appKey: step.appKey,
    iconUrl: step.iconUrl,
    webhookUrl: step.webhookUrl,
    status: step.status,
    position: step.position,
    parameters: step.parameters,
    parentStepId: step.parentStepId,
    structuralType: step.structuralType,
    branchConditions: step.branchConditions,
  };

  if (step.lastExecutionStep) {
    stepData.lastExecutionStep = executionStepSerializer(
      step.lastExecutionStep
    );
  }

  if (step.executionSteps?.length > 0) {
    stepData.executionSteps = step.executionSteps.map((executionStep) =>
      executionStepSerializer(executionStep)
    );
  }

  return stepData;
};

export default stepSerializer;
