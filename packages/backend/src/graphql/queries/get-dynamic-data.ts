import { IDynamicData, IJSONObject } from '@automatisch/types';
import Context from '../../types/express/context';
import App from '../../models/app';
import globalVariable from '../../helpers/global-variable';

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
  const step = await context.currentUser
    .$relatedQuery('steps')
    .withGraphFetched({
      connection: true,
      flow: true,
    })
    .findById(params.stepId);

  if (!step) return null;

  const connection = step.connection;

  if (!connection || !step.appKey) return null;

  const app = await App.findOneByKey(step.appKey);
  const $ = await globalVariable({ connection, app, flow: step.flow, step });

  const command = app.dynamicData.find(
    (data: IDynamicData) => data.key === params.key
  );

  for (const parameterKey in params.parameters) {
    const parameterValue = params.parameters[parameterKey];
    $.step.parameters[parameterKey] = parameterValue;
  }

  const fetchedData = await command.run($);

  if (fetchedData.error) {
    throw new Error(JSON.stringify(fetchedData.error));
  }

  return fetchedData.data;
};

export default getDynamicData;
