import AppConfig from '../../models/app-config';
import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
    allowCustomConnection?: boolean;
    shared?: boolean;
    disabled?: boolean;
  };
};

const updateAppConfig = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'App');

  const {
    id,
    ...appConfigToUpdate
  } = params.input;

  const appConfig = await AppConfig
    .query()
    .findById(id)
    .throwIfNotFound();

  await appConfig
    .$query()
    .patch(
      appConfigToUpdate
    );

  return appConfig;
};

export default updateAppConfig;
