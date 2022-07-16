import App from '../../models/app';
import Context from '../../types/express/context';

type Params = {
  key: string;
};

const getApp = async (_parent: unknown, params: Params, context: Context) => {
  const app = App.findOneByKey(params.key);

  if (context.currentUser) {
    const connections = await context.currentUser
      .$relatedQuery('connections')
      .where({
        key: params.key,
      })
      .orderBy('created_at', 'desc');

    return {
      ...app,
      connections,
    };
  }

  return app;
};

export default getApp;
