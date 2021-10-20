import { GraphQLString, GraphQLNonNull } from 'graphql';
import App from '../../models/app';
import appType from '../types/app';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import Connection from '../../models/connection';
import connectionType from '../types/connection';

type Params = {
  key: string
}

const getAppResolver = async (params: Params, req: RequestWithCurrentUser) => {
  if(!params.key) {
    throw new Error('No key provided.')
  }

  const app = App.findOneByKey(params.key);

  if (req.currentUser?.id) {
    const connections = await Connection.query()
      .where({ user_id: req.currentUser.id, key: params.key });

    return {
      ...app,
      connections,
    };
  }

  return app;
}

const getApp = {
  type: appType,
  args: {
    key: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => getAppResolver(params, req)
}

export default getApp;
