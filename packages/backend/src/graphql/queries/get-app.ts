import App from '../../models/app';
import Connection from '../../models/connection';
import Context from '../../types/express/context';

type Params = {
  key: string;
};

const getApp = async (_parent: unknown, params: Params, context: Context) => {
  const conditions = context.currentUser.can('read', 'Connection');

  const userConnections = context.currentUser.$relatedQuery('connections');
  const allConnections = Connection.query();
  const connectionBaseQuery = conditions.isCreator ? userConnections : allConnections;

  const app = await App.findOneByKey(params.key);

  if (context.currentUser) {
    const connections = await connectionBaseQuery
      .clone()
      .select('connections.*')
      .withGraphFetched({
        appConfig: true,
        appAuthClient: true
      })
      .fullOuterJoinRelated('steps')
      .where({
        'connections.key': params.key,
        'connections.draft': false,
      })
      .countDistinct('steps.flow_id as flowCount')
      .groupBy('connections.id')
      .orderBy('created_at', 'desc');

    return {
      ...app,
      connections,
    };
  }

  return app;
};

export default getApp;
