import App from '../../models/app';
import Context from '../../types/express/context';

type Params = {
  key: string;
};

const getApp = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('read', 'Connection');

  const app = await App.findOneByKey(params.key);

  if (context.currentUser) {
    const connections = await context.currentUser
      .$relatedQuery('connections')
      .select('connections.*')
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
