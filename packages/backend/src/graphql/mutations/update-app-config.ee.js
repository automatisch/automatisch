import AppConfig from '../../models/app-config.js';

const updateAppConfig = async (_parent, params, context) => {
  context.currentUser.can('update', 'App');

  const { id, ...appConfigToUpdate } = params.input;

  const appConfig = await AppConfig.query().findById(id).throwIfNotFound();

  await appConfig.$query().patch(appConfigToUpdate);

  return appConfig;
};

export default updateAppConfig;
