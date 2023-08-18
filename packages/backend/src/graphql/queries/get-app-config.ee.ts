import AppConfig from '../../models/app-config';
import Context from '../../types/express/context';

type Params = {
  key: string;
};

const getAppConfig = async (_parent: unknown, params: Params, context: Context) => {
  context.currentUser.can('create', 'Connection');

  const appConfig = await AppConfig
    .query()
    .withGraphFetched({
      appAuthClients: true
    })
    .findOne({
      key: params.key
    });

  return appConfig;
};

export default getAppConfig;
