import { GraphQLNonNull } from 'graphql';
import App from '../../models/app';
import appType from '../types/app';
import RequestWithCurrentUser from '../../types/express/request-with-current-user';
import Connection from '../../models/connection';
import availableAppsEnumType from '../types/available-apps-enum-type';

type Params = {
  key: string
}

const getAppResolver = async (params: Params, req: RequestWithCurrentUser) => {
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
    key: { type: GraphQLNonNull(availableAppsEnumType) },
  },
  resolve: (_: any, params: Params, req: RequestWithCurrentUser) => getAppResolver(params, req)
}

export default getApp;
