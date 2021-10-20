import { GraphQLList, GraphQLString } from 'graphql';
import Connection from '../../models/connection';
import App from '../../models/app';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import appType from '../types/app';

type Params = {
  name: string
}

const getConnectedAppsResolver = async (params: Params, req: RequestWithCurrentUser) => {
  let apps = App.findAll(params.name)

  const connections = await Connection.query()
    .select('connections.key')
    .count('connections.id as count')
    .where({ user_id: req.currentUser.id, verified: true })
    .groupBy('connections.key')

  const connectionKeys = connections.map(connection => connection.key)

  apps = apps
    .filter((app: any) => connectionKeys.includes(app.key))
    .map((app: any) => {
      const connection = connections
        .find((connection: any) => connection.key === app.key)

      app.connectionCount = connection.count;
      return app;
    })

  return apps;
}

const getConnectedApps = {
  type: GraphQLList(appType),
  args: {
    name: { type: GraphQLString }
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => getConnectedAppsResolver(params, req)
}

export default getConnectedApps;
