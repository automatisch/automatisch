import App from '../../models/app';
import AppConfig from '../../models/app-config';

const createAppConfig = async (_parent, params, context) => {
  context.currentUser.can('update', 'App');

  const key = params.input.key;

  const app = await App.findOneByKey(key);

  if (!app) throw new Error('The app cannot be found!');

  const appConfig = await AppConfig.query().insert(params.input);

  return appConfig;
};

export default createAppConfig;
