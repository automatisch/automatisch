import { IJSONObject } from '@automatisch/types';
import App from '../../models/app';
import Context from '../../types/express/context';

type Params = {
  stepId: string;
  key: string;
  parameters: IJSONObject;
};

const getData = async (_parent: unknown, params: Params, context: Context) => {
  const step = await context.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('connection')
    .findById(params.stepId);

  if (!step) return null;

  const connection = step.connection;

  if (!connection || !step.appKey) return null;

  const appData = App.findOneByKey(step.appKey);
  const AppClass = (await import(`../../apps/${step.appKey}`)).default;

  const appInstance = new AppClass(appData, connection.formattedData, params.parameters);
  const command = appInstance.data[params.key];
  const fetchedData = await command.run();

  return fetchedData;
};

export default getData;
