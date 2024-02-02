import App from '../../models/app.js';
import Connection from '../../models/connection.js';

const getApp = async (_parent, params, context) => {
  const conditions = context.currentUser.can('read', 'Connection');

  const userConnections = context.currentUser.$relatedQuery('connections');
  const allConnections = Connection.query();
  const connectionBaseQuery = conditions.isCreator
    ? userConnections
    : allConnections;

  const app = await App.findOneByKey(params.key);

  if (context.currentUser) {
    const connections = await connectionBaseQuery
      .clone()
      .select('connections.*')
      .withGraphFetched({
        appConfig: true,
        appAuthClient: true,
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
