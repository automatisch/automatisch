import App from '../../models/app';
import Context from '../../types/express/context';

type Params = {
  key: string;
};

const getAppConnections = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const app = App.findOneByKey(params.key);

  const connections = await context.currentUser
    .$relatedQuery('connections')
    .where({
      key: params.key,
    });

  return connections.map((connection) => ({
    ...connection,
    app,
  }));
};

export default getAppConnections;
