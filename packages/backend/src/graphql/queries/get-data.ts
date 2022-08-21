import { IJSONObject } from '@automatisch/types';
import Context from '../../types/express/context';

type Params = {
  stepId: string;
  key: string;
  parameters: IJSONObject;
};

const getData = async (_parent: unknown, params: Params, context: Context) => {
  const step = await context.currentUser
    .$relatedQuery('steps')
    .withGraphFetched('connection, flow')
    .findById(params.stepId);

  if (!step) return null;

  const connection = step.connection;

  if (!connection || !step.appKey) return null;

  const AppClass = (await import(`../../apps/${step.appKey}`)).default;
  const appInstance = new AppClass(connection, step.flow, step);

  const command = appInstance.data[params.key];
  const fetchedData = await command.run();

  return fetchedData;
};

export default getData;
