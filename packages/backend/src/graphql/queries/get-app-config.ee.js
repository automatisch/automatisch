import AppConfig from '../../models/app-config';

const getAppConfig = async (_parent, params, context) => {
  context.currentUser.can('create', 'Connection');

  const appConfig = await AppConfig.query()
    .withGraphFetched({
      appAuthClients: true,
    })
    .findOne({
      key: params.key,
    });

  return appConfig;
};

export default getAppConfig;
