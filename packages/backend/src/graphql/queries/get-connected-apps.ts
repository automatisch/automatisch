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
    .count('connections.id as count')
    .where({ verified: true })
    .groupBy('connections.key');

  const connectionKeys = connections.map((connection) => connection.key);

  apps = apps
    .filter((app: IApp) => connectionKeys.includes(app.key))
    .map((app: IApp) => {
      const connection = connections.find(
        (connection) => (connection as IConnection).key === app.key
      );

      if (connection) {
        app.connectionCount = connection.count;
      }

      return app;
    });

  return apps;
};

export default getConnectedApps;
