import App from '../../models/app';
import Context from '../../types/express/context';
import { IApp, IConnection } from '@automatisch/types';

type Params = {
  name: string;
};

const getConnectedApps = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let apps = await App.findAll(params.name);

  const connections = await context.currentUser
    .$relatedQuery('connections')
    .select('connections.key')
    .where({ draft: false })
    .count('connections.id as count')
    .groupBy('connections.key');

  const flows = await context.currentUser
    .$relatedQuery('flows')
    .withGraphJoined('steps')
    .orderBy('created_at', 'desc');

  const duplicatedUsedApps = flows
    .map((flow) => flow.steps.map((step) => step.appKey))
    .flat()
    .filter(Boolean);

  const connectionKeys = connections.map((connection) => connection.key);
  const usedApps = [...new Set([...duplicatedUsedApps, ...connectionKeys])];

  apps = apps
    .filter((app: IApp) => {
      return usedApps.includes(app.key);
    })
    .map((app: IApp) => {
      const connection = connections.find(
        (connection) => (connection as IConnection).key === app.key
      );

      app.connectionCount = connection?.count || 0;
      app.flowCount = 0;

      flows.forEach((flow) => {
        const usedFlow = flow.steps.find((step) => step.appKey === app.key);

        if (usedFlow) {
          app.flowCount += 1;
        }
      });

      return app;
    });

  return apps;
};

export default getConnectedApps;
