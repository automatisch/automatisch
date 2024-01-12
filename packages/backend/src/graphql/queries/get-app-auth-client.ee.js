import AppAuthClient from '../../models/app-auth-client.js';

const getAppAuthClient = async (_parent, params, context) => {
  let canSeeAllClients = false;
  try {
    context.currentUser.can('read', 'App');

    canSeeAllClients = true;
  } catch {
    // void
  }

  const appAuthClient = AppAuthClient.query()
    .findById(params.id)
    .throwIfNotFound();

  if (!canSeeAllClients) {
    appAuthClient.where({ active: true });
  }

  return await appAuthClient;
};

export default getAppAuthClient;
