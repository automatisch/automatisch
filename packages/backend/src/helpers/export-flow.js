import Crypto from 'crypto';

const exportFlow = async (flow) => {
  const steps = await flow.$relatedQuery('steps');

  const newFlowId = Crypto.randomUUID();
  const stepIdMap = Object.fromEntries(
    steps.map((step) => [step.id, Crypto.randomUUID()])
  );

  const exportedFlow = {
    id: newFlowId,
    name: flow.name,
    steps: steps.map((step) => ({
      id: stepIdMap[step.id],
      key: step.key,
      name: step.name,
      appKey: step.appKey,
      type: step.type,
      parameters: updateParameters(step.parameters, stepIdMap),
      position: step.position,
      webhookPath: step.webhookPath?.replace(flow.id, newFlowId),
    })),
  };

  return exportedFlow;
};

const updateParameters = (parameters, stepIdMap) => {
  if (!parameters) return parameters;

  const stringifiedParameters = JSON.stringify(parameters);
  let updatedParameters = stringifiedParameters;

  Object.entries(stepIdMap).forEach(([oldStepId, newStepId]) => {
    updatedParameters = updatedParameters.replaceAll(
      `{{step.${oldStepId}.`,
      `{{step.${newStepId}.`
    );
  });

  return JSON.parse(updatedParameters);
};

export default exportFlow;
