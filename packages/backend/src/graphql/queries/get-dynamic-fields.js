import App from '../../models/app';
import Step from '../../models/step';
import globalVariable from '../../helpers/global-variable';

const getDynamicFields = async (_parent, params, context) => {
  const conditions = context.currentUser.can('update', 'Flow');
  const userSteps = context.currentUser.$relatedQuery('steps');
  const allSteps = Step.query();
  const stepBaseQuery = conditions.isCreator ? userSteps : allSteps;

  const step = await stepBaseQuery
    .clone()
    .withGraphFetched({
      connection: true,
      flow: true,
    })
    .findById(params.stepId);

  if (!step) return null;

  const connection = step.connection;

  if (!step.appKey) return null;

  const app = await App.findOneByKey(step.appKey);
  const $ = await globalVariable({ connection, app, flow: step.flow, step });

  const command = app.dynamicFields.find((data) => data.key === params.key);

  for (const parameterKey in params.parameters) {
    const parameterValue = params.parameters[parameterKey];
    $.step.parameters[parameterKey] = parameterValue;
  }

  const additionalFields = (await command.run($)) || [];

  return additionalFields;
};

export default getDynamicFields;
