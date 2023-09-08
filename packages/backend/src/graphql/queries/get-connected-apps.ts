import { IConnection } from '@automatisch/types';
import App from '../../models/app';
import Context from '../../types/express/context';
import Flow from '../../models/flow';
import Connection from '../../models/connection';

type Params = {
  name: string;
};

const getConnectedApps = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('read', 'Connection');

  const userConnections = context.currentUser.relatedConnectionsQuery();
  const allConnections = Connection.query();
  const connectionBaseQuery = conditions.isCreator ? userConnections : allConnections;

  const userFlows = context.currentUser.$relatedQuery('flows');
  const allFlows = Flow.query();
  const flowBaseQuery = conditions.isCreator ? userFlows : allFlows;

  let apps = await App.findAll(params.name);

  const connections = await Connection
    .query()
    .with('connections', connectionBaseQuery)
    .select('connections.key')
    .where({ draft: false })
    .count('connections.id as count')
    .groupBy('connections.key');

  const flows = await flowBaseQuery
    .clone()
    .withGraphJoined('steps')
    .orderBy('created_at', 'desc');

  const duplicatedUsedApps = flows
    .map((flow) => flow.steps.map((step) => step.appKey))
    .flat()
    .filter(Boolean);

  const connectionKeys = connections.map((connection) => connection.key);
  const usedApps = [...new Set([...duplicatedUsedApps, ...connectionKeys])];

  apps = apps
    .filter((app) => {
      return usedApps.includes(app.key);
    })
    .map((app) => {
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
    })
    .sort((appA, appB) => appA.name.localeCompare(appB.name));

  return apps;
};

export default getConnectedApps;
