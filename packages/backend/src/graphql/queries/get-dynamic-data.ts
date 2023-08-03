import { IDynamicData, IJSONObject } from '@automatisch/types';
import Context from '../../types/express/context';
import App from '../../models/app';
import Step from '../../models/step';
import ExecutionStep from '../../models/execution-step';
import globalVariable from '../../helpers/global-variable';
import computeParameters from '../../helpers/compute-parameters';

type Params = {
  stepId: string;
  key: string;
  parameters: IJSONObject;
};

const getDynamicData = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
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

  if (!connection || !step.appKey) return null;

  const flow = step.flow;
  const app = await App.findOneByKey(step.appKey);
  const $ = await globalVariable({ connection, app, flow, step });

  const command = app.dynamicData.find(
    (data: IDynamicData) => data.key === params.key
  );

  // apply run-time parameters that're not persisted yet
  for (const parameterKey in params.parameters) {
    const parameterValue = params.parameters[parameterKey];
    $.step.parameters[parameterKey] = parameterValue;
  }

  const lastExecution = await flow.$relatedQuery('lastExecution');
  const lastExecutionId = lastExecution?.id;

  const priorExecutionSteps = lastExecutionId ? await ExecutionStep.query().where({
    execution_id: lastExecutionId,
  }) : [];

  // compute variables in parameters
  const computedParameters = computeParameters($.step.parameters, priorExecutionSteps);

  $.step.parameters = computedParameters;

  const fetchedData = await command.run($);

  if (fetchedData.error) {
    throw new Error(JSON.stringify(fetchedData.error));
  }

  return fetchedData.data;
};

export default getDynamicData;
