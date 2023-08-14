import AppAuthClient from '../../models/app-auth-client';
import Context from '../../types/express/context';

type Params = {
  id: string;
};

const getAppAuthClient = async (_parent: unknown, params: Params, context: Context) => {
  let canSeeAllClients = false;
  try {
    context.currentUser.can('read', 'App');

    canSeeAllClients = true;
  } catch {
    // void
  }

  const appAuthClient = AppAuthClient
    .query()
    .findById(params.id)
    .throwIfNotFound();

  if (!canSeeAllClients) {
    appAuthClient.where({ active: true });
  }

  return await appAuthClient;
};

export default getAppAuthClient;
