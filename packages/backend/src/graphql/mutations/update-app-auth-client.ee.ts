import { IJSONObject } from '@automatisch/types';
import AppAuthClient from '../../models/app-auth-client';
import Context from '../../types/express/context';

type Params = {
  input: {
    id: string;
    name: string;
    formattedAuthDefaults?: IJSONObject;
    active?: boolean;
  };
};

const updateAppAuthClient = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('update', 'App');

  const {
    id,
    ...appAuthClientData
  } = params.input;

  const appAuthClient = await AppAuthClient
    .query()
    .findById(id)
    .throwIfNotFound();

  await appAuthClient
    .$query()
    .patch(appAuthClientData);

  return appAuthClient;
};

export default updateAppAuthClient;
