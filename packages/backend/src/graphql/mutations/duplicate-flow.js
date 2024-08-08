function updateStepId(value, newStepIds) {
  let newValue = value;

  const stepIdEntries = Object.entries(newStepIds);
  for (const stepIdEntry of stepIdEntries) {
    const [oldStepId, newStepId] = stepIdEntry;
    const partialOldVariable = `{{step.${oldStepId}.`;
    const partialNewVariable = `{{step.${newStepId}.`;

    newValue = newValue.replace(partialOldVariable, partialNewVariable);
  }

  return newValue;
}

function updateStepVariables(parameters, newStepIds) {
  const entries = Object.entries(parameters);
  return entries.reduce((result, [key, value]) => {
    if (typeof value === 'string') {
      return {
        ...result,
        [key]: updateStepId(value, newStepIds),
      };
    }

    if (Array.isArray(value)) {
      return {
        ...result,
        [key]: value.map((item) => updateStepVariables(item, newStepIds)),
      };
    }

    return {
      ...result,
      [key]: value,
    };
  }, {});
}

const duplicateFlow = async (_parent, params, context) => {
  context.currentUser.can('create', 'Flow');

  const flow = await context.currentUser
    .authorizedFlows
    .withGraphJoined('[steps]')
    .orderBy('steps.position', 'asc')
    .findOne({ 'flows.id': params.input.id })
    .throwIfNotFound();

  const duplicatedFlow = await context.currentUser
    .$relatedQuery('flows')
    .insert({
      name: `Copy of ${flow.name}`,
      active: false,
    });

  const newStepIds = {};
  for (const step of flow.steps) {
    const duplicatedStep = await duplicatedFlow.$relatedQuery('steps').insert({
      key: step.key,
      appKey: step.appKey,
      type: step.type,
      connectionId: step.connectionId,
      position: step.position,
      parameters: updateStepVariables(step.parameters, newStepIds),
    });

    if (duplicatedStep.isTrigger) {
      await duplicatedStep.updateWebhookUrl();
    }

    newStepIds[step.id] = duplicatedStep.id;
  }

  return duplicatedFlow;
};

export default duplicateFlow;
