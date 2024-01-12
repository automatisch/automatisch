import AppAuthClient from '../../models/app-auth-client.js';

const updateAppAuthClient = async (_parent, params, context) => {
  context.currentUser.can('update', 'App');

  const { id, ...appAuthClientData } = params.input;

  const appAuthClient = await AppAuthClient.query()
    .findById(id)
    .throwIfNotFound();

  await appAuthClient.$query().patch(appAuthClientData);

  return appAuthClient;
};

export default updateAppAuthClient;
