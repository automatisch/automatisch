import App from '../../models/app';
import AppConfig from '../../models/app-config';
import Context from '../../types/express/context';

type Params = {
  input: {
    key: string;
    allowCustomConnection?: boolean;
    shared?: boolean;
    disabled?: boolean;
  };
};

const createAppConfig = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'App');

  const key = params.input.key;

  const app = await App.findOneByKey(key);

  if (!app) throw new Error('The app cannot be found!');

  const appConfig = await AppConfig
    .query()
    .insert(
      params.input
    );

  return appConfig;
};

export default createAppConfig;
