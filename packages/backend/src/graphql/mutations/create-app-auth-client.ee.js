import AppConfig from '../../models/app-config';

const createAppAuthClient = async (_parent, params, context) => {
  context.currentUser.can('update', 'App');

  const appConfig = await AppConfig.query()
    .findById(params.input.appConfigId)
    .throwIfNotFound();

  const appAuthClient = await appConfig
    .$relatedQuery('appAuthClients')
    .insert(params.input);

  return appAuthClient;
};

export default createAppAuthClient;
