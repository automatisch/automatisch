import Context from '../../types/express/context';
import Step from '../../models/step';

type Params = {
  input: {
    id: string;
  };
};

type NewStepIds = Record<string, string>;

function updateStepId(value: string, newStepIds: NewStepIds) {
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

function updateStepVariables(parameters: Step['parameters'], newStepIds: NewStepIds): Step['parameters'] {
  const entries = Object.entries(parameters);
  return entries.reduce((result, [key, value]: [string, unknown]) => {
    if (typeof value === 'string') {
      return {
        ...result,
        [key]: updateStepId(value, newStepIds),
      };
    }

    if (Array.isArray(value)) {
      return {
        ...result,
        [key]: value.map(item => updateStepVariables(item, newStepIds)),
      };
    }

    return {
      ...result,
      [key]: value,
    };
  }, {});
}

const duplicateFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('create', 'Flow');

  const flow = await context.currentUser
    .$relatedQuery('flows')
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

  const newStepIds: NewStepIds = {};
  for (const step of flow.steps) {
    const duplicatedStep = await duplicatedFlow.$relatedQuery('steps')
      .insert({
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
