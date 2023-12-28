import AppAuthClient from '../../models/app-auth-client';

const deleteAppAuthClient = async (_parent, params, context) => {
  context.currentUser.can('delete', 'App');

  await AppAuthClient.query()
    .delete()
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  return;
};

export default deleteAppAuthClient;
