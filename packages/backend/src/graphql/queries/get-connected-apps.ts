import { raw } from 'objection';
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
  let apps = App.findAll(params.name);

  const connections = await context.currentUser
    .$relatedQuery('connections')
    .select('connections.key')
    .where({ draft: false })
    .count('connections.id as count')
    .groupBy('connections.key');

  const connectionKeys = connections.map((connection) => connection.key);

  const flows = await context.currentUser
    .$relatedQuery('steps')
    .select('flow_id', raw('ARRAY_AGG(app_key)').as('apps'))
    .groupBy('flow_id') as unknown as { flow_id: string; apps: string[] }[];

  const appFlowCounts = flows.reduce((counts, flow) => {
    const apps = flow.apps;
    const unifiedApps = Array.from(new Set(apps))

    for (const app of unifiedApps) {
      if (!counts[app]) {
        counts[app] = 0;
      }

      counts[app] += 1;
    }

    return counts;
  }, {} as { [key: string]: number });

  apps = apps
    .filter((app: IApp) => {
      const hasConnections = connectionKeys.includes(app.key);
      const hasFlows = flows.find((flow) => flow.apps.includes(app.key));

      return hasFlows || hasConnections;
    })
    .map((app: IApp) => {
      const connection = connections.find(
        (connection) => (connection as IConnection).key === app.key
      );

      app.connectionCount = connection?.count || 0;

      app.flowCount = appFlowCounts[app.key];

      return app;
    });

  return apps;
};

export default getConnectedApps;
