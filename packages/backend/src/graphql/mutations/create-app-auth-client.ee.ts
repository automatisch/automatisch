import { IJSONObject } from '@automatisch/types';
import AppConfig from '../../models/app-config';
import Context from '../../types/express/context';

type Params = {
  input: {
    appConfigId: string;
    name: string;
    formattedAuthDefaults?: IJSONObject;
    active?: boolean;
  };
};

const createAppAuthClient = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'App');

  const appConfig = await AppConfig
    .query()
    .findById(params.input.appConfigId)
    .throwIfNotFound();

  const appAuthClient = await appConfig
    .$relatedQuery('appAuthClients')
    .insert(
      params.input
    );

  return appAuthClient;
};

export default createAppAuthClient;
